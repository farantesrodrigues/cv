import json
import openai
from openai import OpenAI
import os
import time
from prompts import get_academic_prompt, get_experience_prompt, get_system_message, get_technical_skills_prompt 

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def determine_system_message(message):
    # Convert message to lowercase for uniform matching
    message = message.lower()

    # Define keyword sets for different types of questions
    academic_keywords = {"academic", "degree", "education", "school", "university", "college", "studies", "gpa"}
    experience_keywords = {"experience", "projects", "career", "work", "job", "professional", "roles", "positions"}
    skills_keywords = {"skills", "technologies", "languages", "tools", "expertise", "proficiency", "tech stack", "knowledge"}

    # Determine which prompt to use
    if any(keyword in message for keyword in academic_keywords):
        return get_academic_prompt()
    elif any(keyword in message for keyword in experience_keywords):
        return get_experience_prompt()
    elif any(keyword in message for keyword in skills_keywords):
        return get_technical_skills_prompt()
    else:
        return get_system_message()


def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event, indent=2))

        # Extract the message parameter from the event
        message = event.get("queryStringParameters", {}).get("message", "").strip()

        if not message:
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,GET"
                },
                "body": json.dumps({"error": "Message parameter is missing"})
            }

        # Determine the appropriate prompt
        system_message = determine_system_message(message)

        # Construct the chat messages for OpenAI
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": message}
        ]

        # Call OpenAI API to get a response with a retry mechanism
        retries = 3
        for i in range(retries):
            try:
                completion = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages
                )
                bot_reply = completion.choices[0].message.content
                break
            except openai.OpenAIError as e:
                if i < retries - 1:
                    print(f"Retry {i + 1} due to error: {e}")
                    time.sleep(2 * (i + 1))  # Exponential backoff
                else:
                    raise e

        # Return bot's response
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": json.dumps({"botReply": bot_reply})
        }

    except openai.OpenAIError as error:
        # Handle known OpenAI API errors, such as quota exceeded
        error_message = str(error)
        if 'insufficient_quota' in error_message:
            response_message = (
                "I'm currently experiencing an issue due to insufficient quota. "
                "Please try again later or contact support if the issue persists."
            )
        else:
            response_message = (
                "An unexpected error occurred while processing your request. Please try again later."
            )
        print(f"Error occurred: {error}")

        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": json.dumps({"error": response_message})
        }

    except Exception as error:
        print(f"Error occurred: {error}")

        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": json.dumps({"error": "Internal Server Error"})
        }
