import json
import openai
import os
import time
import boto3
from prompts import get_academic_prompt, get_hobbies_prompt, get_management_experience_prompt, get_master_prompt, get_software_experience_prompt, get_system_message, get_technical_skills_prompt


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SessionMemory')
client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# Helper Functions for Session Memory
def store_session_data(session_id, data):
    try:
        table.put_item(
            Item={
                'session_id': session_id,
                'data': data
            }
        )
        print(f"Stored session data for session_id: {session_id}")
    except Exception as e:
        print(f"Error storing session data: {str(e)}")
        raise e


def get_session_data(session_id):
    try:
        response = table.get_item(Key={'session_id': session_id})
        session_data = response.get('Item', {}).get('data', {})
        print(f"Retrieved session data for session_id: {session_id} - {session_data}")
        return session_data
    except Exception as e:
        print(f"Error retrieving session data: {str(e)}")
        raise e
    

def determine_system_message(message, session_data):
    message = message.lower().strip()

    # Track user intent for future responses
    if "experience" in message or "software" in message or "development" in message or "career" in message:
        session_data["experience_asked"] = True

    academic_keywords = {
        "academic", "degree", "education", "university", "college", "studies", "qualification", "course", "school"
    }
    management_keywords = {
        "management", "manager", "marketing", "leadership", "sales", "business", "operations", "director", "executive"
    }
    skills_keywords = {
        "skills", "technologies", "languages", "tools", "expertise", "knowledge", "proficiency", "tech stack", "capabilities"
    }
    hobbies_keywords = {
        "hobbies", "interests", "personal", "free time", "pastime", "leisure", "outside work", "outside of work"
    }
    software_development_keywords = {
        "software", "development", "developer", "coding", "programming", "technology", "engineering", "technical", "tech", "code"
    }


    # Use the master prompt as the base context
    master_prompt = get_master_prompt()

    # Append specific prompts based on user message, allowing different topics even if experience has been asked
    if any(keyword in message for keyword in skills_keywords):
        # Directly handle skills-related questions
        specific_prompt = get_technical_skills_prompt()

    elif any(keyword in message for keyword in academic_keywords):
        # Directly handle academic-related questions
        specific_prompt = get_academic_prompt()

    elif any(keyword in message for keyword in management_keywords):
        # Directly handle management-related questions
        specific_prompt = get_management_experience_prompt()

    elif any(keyword in message for keyword in software_development_keywords):
        # Directly handle software development questions
        specific_prompt = get_software_experience_prompt()

    elif session_data.get("experience_asked"):
        # Default to software experience if the user has asked about experience generally
        specific_prompt = get_software_experience_prompt()

    elif any(keyword in message for keyword in hobbies_keywords):
        # Only discuss hobbies if explicitly asked
        specific_prompt = get_hobbies_prompt()

    else:
        # Default response when no specific context is clear
        specific_prompt = get_system_message()

    # Combine the master prompt and specific prompt
    return f"{master_prompt}\n\n{specific_prompt}"



def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event, indent=2))

        message = event.get("queryStringParameters", {}).get("message", "").strip()
        session_id = event.get("queryStringParameters", {}).get("sessionId", "").strip()

        if not message or not session_id:
            return {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Message or sessionId parameter is missing"})
            }

        # Retrieve session data from DynamoDB
        session_data = get_session_data(session_id)

        # Determine the appropriate prompt or response
        system_message = determine_system_message(message, session_data)

        # Store updated session data back to DynamoDB
        store_session_data(session_id, session_data)

        # Construct the chat messages for OpenAI
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": message}
        ]

        retries = 3
        bot_reply = None
        for i in range(retries):
            try:
                completion = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    temperature=0
                )
                bot_reply = completion.choices[0].message.content
                print(f"Bot reply: {bot_reply}")
                break
            except openai.OpenAIError as e:
                if i < retries - 1:
                    print(f"Retry {i + 1} due to error: {str(e)}")
                    time.sleep(2 * (i + 1))  # Exponential backoff
                else:
                    print(f"Error after retries: {str(e)}")
                    raise e

        if bot_reply is None:
            return {
                "statusCode": 500,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Failed to get response from OpenAI after retries"})
            }

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"botReply": bot_reply})
        }

    except Exception as error:
        error_message = str(error)
        print(f"General error occurred: {error_message}")

        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Internal Server Error"})
        }