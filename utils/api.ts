import axios from 'axios';

const API_URL_MANUAL =
  'https://7bz7lvsdtf.execute-api.us-east-1.amazonaws.com/chatbot';
const API_URL_OPEN_AI =
  'https://7bz7lvsdtf.execute-api.us-east-1.amazonaws.com/chatbot-openai';

export const getManualBotReply = getBotReply(API_URL_MANUAL);
export const getOpenAIBotReply = getBotReply(API_URL_OPEN_AI);

function getBotReply(api_url: string) {
  return async (message: string) => {
    try {
      const response = await axios.get(api_url, {
        params: { message },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.botReply;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return "Sorry, I'm having trouble understanding that.";
    }
  };
}
