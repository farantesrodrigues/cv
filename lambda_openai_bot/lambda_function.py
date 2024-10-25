import json
import openai
import os
import boto3
import logging
import time
import difflib
import re

# ================================================
# Logging Configuration
# ================================================

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# ================================================
# Initialization
# ================================================

openai.api_key = os.environ.get("OPENAI_API_KEY")

# DynamoDB Initialization
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SessionMemory')

cached_cv_data = None

def load_cv_data():
    """
    Load the cvData.json file from the local dir, cache it, and exclude the 'contact' and 'references' sections to reduce prompt size.
    """
    global cached_cv_data
    if cached_cv_data is not None:
        return cached_cv_data

    try:
        with open('cvData.json', 'r') as f:
            cached_cv_data = json.load(f)
        
        # Exclude 'contact' and 'references' sections
        cached_cv_data.pop('contact', None)
        cached_cv_data.pop('references', None)

        logger.info("Loaded CV data successfully, excluding 'contact' and 'references' sections.")
        return cached_cv_data
    except Exception as e:
        logger.error(f"Error loading cvData: {str(e)}")
        raise e

# ================================================
# Helper Functions for DynamoDB Session Management
# ================================================

def store_session_data(session_id, data):
    """
    Store session data in DynamoDB for tracking conversation state.
    """
    try:
        table.put_item(Item={'session_id': session_id, 'data': data})
        logger.info(f"Stored session data for session ID: {session_id}")
    except Exception as e:
        logger.error(f"Error storing session data for session ID {session_id}: {str(e)}")
        raise e

def get_session_data(session_id):
    """
    Retrieve session data from DynamoDB.
    """
    try:
        response = table.get_item(Key={'session_id': session_id})
        logger.info(f"Retrieved session data for session ID: {session_id}")
        return response.get('Item', {}).get('data', {})
    except Exception as e:
        logger.error(f"Error retrieving session data for session ID {session_id}: {str(e)}")
        raise e

# ================================================
# Helper Functions for Topic Tracking
# ================================================

def fuzzy_match(keyword, user_message, threshold=0.8):
    """
    Use difflib's SequenceMatcher to perform fuzzy matching.
    """
    ratio = difflib.SequenceMatcher(None, keyword, user_message).ratio()
    return ratio > threshold

topic_keywords = {
    "Academic Background": [
        "education", "degree", "study", "university", "school", "academic", "course", "gpa"
    ],
    "Work Experience": [
        "experience", "work", "career", "job", "role", "position", "employment", "project", "professional"
    ],
    "Software Experience": [
        "software", "development", "coding", "programming", "engineering", "technology", "tech", "developer",
        "software engineer", "frontend", "backend", "full stack", "data engineer", "devops", "cloud", "api", 
        "machine learning", "data science", "software project", "framework", "version control", "database", "CI/CD"
    ],
    "Business Experience": [
        "business", "management", "marketing", "sales", "strategy", "logistics", "clients", "branding",
        "campaign", "market analysis"
    ],
    "Skills": [
        "skills", "technologies", "languages", "tools", "frameworks", "abilities", "competencies", "expertise"
    ],
    "Hobbies and Personal Interests": [
        "hobbies", "interests", "activities", "leisure", "sports", "passion", "pastime", "recreation"
    ]
}

def update_topic_state(session_data, user_message):
    """
    Update the current topic state in the session data based on the user's message.
    If a new topic or subtopic is detected, update the state accordingly. 
    This function supports more robust matching using keyword variations, 
    regular expressions, and fuzzy matching.
    """
    user_message_lower = user_message.lower()
    new_topic = None

    # Track keyword matches with counts
    topic_match_counts = {topic: 0 for topic in topic_keywords}

    # Check each keyword list to find matches in the user's message
    for topic, keywords in topic_keywords.items():
        for keyword in keywords:
            # Use regular expressions for matching keyword variations
            if re.search(r'\b' + re.escape(keyword) + r'\b', user_message_lower):
                topic_match_counts[topic] += 1

            # Apply fuzzy matching with a threshold of 0.8 (80% similarity)
            if fuzzy_match(keyword, user_message_lower, threshold=0.8):
                topic_match_counts[topic] += 1

    # Determine the topic or subtopic with the highest match count
    max_matches = max(topic_match_counts.values())
    if max_matches > 0:
        # Prioritize subtopics over general topics if both have matches
        potential_topics = [topic for topic, count in topic_match_counts.items() if count == max_matches]
        # Choose the more specific topic if available
        for specific_topic in ["Software Experience", "Business Experience"]:
            if specific_topic in potential_topics:
                new_topic = specific_topic
                break
        # Fallback to the general topic with the highest match count
        if not new_topic:
            new_topic = max(topic_match_counts, key=topic_match_counts.get)

    # Track previous topic and update to the new one if necessary
    previous_topic = session_data.get('current_topic')
    if new_topic and new_topic != previous_topic:
        session_data['previous_topic'] = previous_topic
        session_data['current_topic'] = new_topic
        logger.info(f"Updated topic from '{previous_topic}' to '{new_topic}'")
    else:
        logger.info("No relevant topic detected in the user's message or the topic remains the same.")

    return session_data

# ================================================
# Main Prompt Function
# ================================================

def generate_prompt(user_message, cv_data):
    """
    Generate a single prompt that combines assessment and reformulation steps.
    """
    cv_data_str = json.dumps(cv_data, indent=2)
    combined_prompt = (
        "You are Francisco Arantes, a highly experienced software developer with a strong track record in the banking industry "
        "and various technical domains. Below is your structured CV data, which includes academic background, work experience, "
        "technical skills, management experience, and personal interests. This CV data is designed to provide recruiters with "
        "a comprehensive view of your professional journey, skill set, and career achievements.\n\n"
        "Carefully review the CV data and use it to identify the most relevant sections and details that will help answer the user's "
        "query with maximum accuracy and informativeness. The goal is to address the query in a way that meets professional expectations "
        "and aligns with what recruiters typically look for in a candidate.\n\n"
        "CV Data:\n"
        f"{cv_data_str}\n\n"
        f"User's query: {user_message}\n\n"
        "Instructions:\n"
        "1. Identify the sections of the CV that are most relevant to the user's query.\n"
        "2. Highlight key accomplishments, roles, skills, and experiences that directly address the query.\n"
        "3. Emphasize any aspects of the CV that demonstrate Francisco's impact in previous roles, problem-solving skills, "
        "and leadership abilities.\n"
        "4. If the query pertains to technical skills, focus on projects, technologies used, and the outcomes achieved. "
        "Provide context on how these skills were applied in a professional setting.\n"
        "5. When the query is about the academic background, provide details about the degree programs, relevant courses, and "
        "how the education contributed to Francisco's career development.\n"
        "6. Ensure the response is detailed, yet concise, and maintains a professional tone. Avoid irrelevant information.\n\n"
        "Reformulate the user's question to make it more precise, focusing on the specific details from the CV that will provide "
        "a high-quality and informative answer. But omit reformulations from the answer to avoid repeting information to the user."
        "Respond in the first person, as if you are Francisco Arantes speaking directly. Do not include phrases such as 'User asked' or 'As Francisco Arantes, I would respond.' "
        "Start the response naturally, as if I am sharing my experiences and answering the question directly."
    )
    
    return [
        {"role": "system", "content": combined_prompt}
    ]


# ================================================
# Lambda Handler: Entry Point for Lambda Execution
# ================================================

def lambda_handler(event, context):
    """
    Main entry point for the Lambda function.
    Handles incoming requests, processes the user's message, and returns the bot's response.
    """
    start_time = time.time()
    global cached_cv_data

    logger.debug(f"Current topic: {cached_cv_data}")

    try:
        logger.info("Received event: %s", json.dumps(event, indent=2))
        step_start = time.time()

        # Step 1: Parse input parameters
        message = event.get("queryStringParameters", {}).get("message", "").strip()
        session_id = event.get("queryStringParameters", {}).get("sessionId", "").strip()
        logger.debug(f"Step 1 (Parse input parameters) took {time.time() - step_start:.2f} seconds")

        if not message or not session_id:
            logger.warning("Missing message or session ID in the request.")
            return {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Message or sessionId parameter is missing"})
            }

        # Step 2: Ensure CV data is loaded
        step_start = time.time()
        if cached_cv_data is None:
            cached_cv_data = load_cv_data()
            logger.info("Loaded CV data for the first time.")
        logger.debug(f"Step 2 (Ensure CV data is loaded) took {time.time() - step_start:.2f} seconds")

        # Step 3: Retrieve session data from DynamoDB
        step_start = time.time()
        session_data = get_session_data(session_id)
        logger.debug(f"Step 3 (Retrieve session data) took {time.time() - step_start:.2f} seconds")

        # Step 4: Update topic state
        step_start = time.time()
        session_data = update_topic_state(session_data, message)
        current_topic = session_data.get('current_topic', 'Unknown')
        previous_topic = session_data.get('previous_topic', 'None')
        logger.info(f"Current topic: {current_topic}, Previous topic: {previous_topic}")
        logger.debug(f"Step 4 (Update topic state) took {time.time() - step_start:.2f} seconds")

        # Step 5: Add conversation history to session data
        step_start = time.time()
        if 'conversation_history' not in session_data:
            session_data['conversation_history'] = []
        session_data['conversation_history'].append({"user": message})
        logger.debug(f"Step 5 (Add conversation history) took {time.time() - step_start:.2f} seconds")

        # Step 6: Generate the prompt
        step_start = time.time()
        combined_prompt_messages = generate_prompt(message, cached_cv_data)
        conversation_history = session_data.get('conversation_history', [])
        if conversation_history:
            history_str = "\n".join([f"User: {entry['user']}" for entry in conversation_history[-3:]])
            combined_prompt_messages[0]['content'] += f"\n\nRecent Conversation:\n{history_str}"
        logger.info("Generated combined prompt.")
        logger.debug(f"Step 6 (Generate the prompt) took {time.time() - step_start:.2f} seconds")

        # Step 7: Get the response from OpenAI for the prompt
        step_start = time.time()
        combined_response = openai.chat.completions.create(
            model="gpt-4",
            messages=combined_prompt_messages,
            temperature=0
        ).choices[0].message.content
        logger.info("Received response from OpenAI for the prompt.")
        logger.debug(f"Step 7 (Get response from OpenAI) took {time.time() - step_start:.2f} seconds")

        # Step 8: Store updated session data
        step_start = time.time()
        store_session_data(session_id, session_data)
        logger.debug(f"Step 8 (Store updated session data) took {time.time() - step_start:.2f} seconds")

        # Step 9: Return the response to the user
        step_start = time.time()
        response = {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"botReply": combined_response})
        }
        logger.debug(f"Step 9 (Return the response to the user) took {time.time() - step_start:.2f} seconds")
        return response

    except Exception as error:
        logger.exception("General error occurred.")
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Internal Server Error"})
        }
    
    finally:
        elapsed_time = time.time() - start_time
        logger.debug(f"Lambda execution completed in {elapsed_time:.2f} seconds")
