import axios from 'axios';

const API_URL_MANUAL =
  'https://7bz7lvsdtf.execute-api.us-east-1.amazonaws.com/chatbot';
const API_URL_OPEN_AI =
  'https://7bz7lvsdtf.execute-api.us-east-1.amazonaws.com/chatbot-openai';

export function getBotReply(api_url: string) {
  return async (message: string, sessionId: string) => {
    try {
      const response = await axios.get(api_url, {
        params: { message, sessionId },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.botReply;
    } catch (error) {
      console.error('Error fetching bot reply:', error);
      return "I'm sorry, I encountered an issue. Please try again.";
    }
  };
}

export const getManualBotReply = getBotReply(API_URL_MANUAL);
export const getOpenAIBotReply = getBotReply(API_URL_OPEN_AI);