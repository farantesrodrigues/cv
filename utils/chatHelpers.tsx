import axios from 'axios';
import { Message } from '@/stores/chatStore';
import jsPDF from 'jspdf';

/***
 * Serverless interaction
 */

const API_URL_MANUAL = `${process.env.NEXT_PUBLIC_LAMBDA_DOMAIN}/chatbot`;
const API_URL_OPEN_AI = `${process.env.NEXT_PUBLIC_LAMBDA_DOMAIN}/chatbot-openai`;

function getBotReply(api_url: string) {
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

/***
 * Session helpers
 */

export function getSessionId() {
  let sessionId = sessionStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

/***
 * Parse input helpers
 */

// Simple markdown parser for **bold** text
export function parseMarkdownSimple(text: string) {
  // Handle bold (**text**)
  const boldParsed = text.split(/\*\*(.*?)\*\*/g).map((segment, index) => {
    return index % 2 === 1 ? <strong key={index}>{segment}</strong> : segment;
  });

  return boldParsed;
};

// Function to parse response text for newlines and markdown (like **bold**)
export function parseResponseText(text: string) {
  // First, replace newlines with line breaks
  const lines = text.split('\n').map((line, index) => (
    <span key={index}>
      {parseMarkdownSimple(line)}
      <br />
    </span>
  ));

  return lines;
};

/***
 * Export chat helpers
 */

function loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (error) => reject(error);
        img.src = url;
    });
};

// Function to generate a dynamic file name based on timestamp
const generateFileName = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // Format: HH-MM-SS
    return `chat-export-${date}-${time}.pdf`;
};

export async function exportChatToPdf(messages: Message[], contactInfo = { name: "Francisco Arantes", email: "farantesrodrigues@gmail.com", phone: "+32 (0) 486 970 355" }) {
    const doc = new jsPDF();

    try {
        // Load avatar as Base64
        const avatarBase64 = await loadImageAsBase64('/my-avatar.webp'); // Replace with the actual path to your image

        // Set up initial styles
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        // Adding the avatar image and contact info
        doc.addImage(avatarBase64, 'PNG', 10, 10, 20, 20); // Add avatar image at (x, y) with width and height
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(contactInfo.name, 35, 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Email: ${contactInfo.email}`, 35, 22);
        doc.text(`Phone: ${contactInfo.phone}`, 35, 28);

        // Title for the chat export below the header
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Chat Conversation Export', 105, 40, { align: 'center' });
        doc.line(10, 45, 200, 45); // Add a horizontal line to separate header from content

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        let yOffset = 50; // Start below the title
        const pageHeight = doc.internal.pageSize.height;
        const lineHeight = 6; // Reduced line height to minimize space between lines
        const maxLineWidth = 180; // Maximum width for wrapping text
        const bottomMargin = 20;

        // Iterate through messages and format content for PDF
        messages.forEach((msg) => {
            const sender = msg.sender === 'bot' ? 'Bot:' : 'You:';
            let text = `${sender} ${msg.text}`;

            // Add multi-line text wrapping to fit within page margins
            const splitText = doc.splitTextToSize(text, maxLineWidth);
            let textIndex = 0;

            while (textIndex < splitText.length) {
                // Calculate how much of the splitText can fit on the current page
                const remainingHeight = pageHeight - yOffset - bottomMargin;
                const linesPerPage = Math.floor(remainingHeight / lineHeight);
                const linesToPrint = Math.min(linesPerPage, splitText.length - textIndex);
                const currentText = splitText.slice(textIndex, textIndex + linesToPrint);

                // Set text color based on sender for better distinction
                if (msg.sender === 'bot') {
                    doc.setTextColor(0); // Black for bot
                } else {
                    doc.setTextColor(0, 102, 204); // Blue for user
                }

                // Draw the current part of the message
                doc.text(currentText, 10, yOffset);
                yOffset += linesToPrint * lineHeight;

                // Move to next set of lines
                textIndex += linesToPrint;

                // If more text remains, add a new page
                if (textIndex < splitText.length) {
                    doc.addPage();
                    yOffset = 20; // Reset offset for new page
                }
            }

            // Minimal spacing after each message
            yOffset += lineHeight / 3; // Reduced spacing between messages

            // Check if we need to start a new page before the next message
            if (yOffset > pageHeight - bottomMargin) {
                doc.addPage();
                yOffset = 20;
            }
        });

        // Generate a dynamic file name
        const fileName = generateFileName();

        // Save the document with the dynamic file name
        doc.setTextColor(0);
        doc.save(fileName);
    } catch (error) {
        console.error('Error loading avatar image:', error);
    }
};
