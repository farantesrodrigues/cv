import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

export const logoUrls: { [key: string]: string } = {
    awsS3: '/aws-s3-logo.png',
    awsLambda: '/aws-lambda-logo.png',
    openAI: '/openai-logo.png',
    awsDynamoDB: '/aws-dynamo-logo.jpeg',
    awsCognito: '/aws-cognito-logo.png',
    awsApiGateway: '/aws-apigateway-logo.png',
    github: '/github-logo.png',
    typescript: '/ts-logo.png',
    javascript: '/js-logo.png',
    python: '/python-logo.png',
};

interface ProjectModalProps {
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-[800px] h-auto max-h-[90%] overflow-auto relative">
        {/* Sticky Toolbar */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Project Info</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close Modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Project Info */}
        <div className="cv-container p-6 space-y-8">
          {/* Personal Motivation Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Personal Motivation</h3>
            <div className="flex items-center">
              <img src="/my-avatar.webp" alt="My Avatar" className="w-16 h-16 rounded-full mr-4" />
              <div>
                <p>
                  I wanted to create a project that showcases my experience in prompt engineering and cloud integration.
                  This project allows me to experiment with advanced features of cloud computing and prompt design, 
                  combining AWS and OpenAI to create a robust, serverless application.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Implementation Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Technical Implementation</h3>

            {/* Frontend Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.awsS3} alt="AWS S3" className="w-6 h-6 mr-2" />
                Frontend - React App Deployed on AWS S3
              </h4>
              <p>
                The frontend is a React application written in TypeScript, deployed to an S3 bucket for static hosting.
                AWS S3 ensures high availability and scalability, allowing users to access a fast and responsive interface 
                without extensive infrastructure requirements.
              </p>
            </div>

            {/* API Gateway Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.awsApiGateway} alt="API Gateway" className="w-6 h-6 mr-2" />
                AWS API Gateway
              </h4>
              <p>
                AWS API Gateway acts as the interface between the frontend and backend, securely routing requests to 
                the Lambda functions. This setup provides a streamlined and secure communication channel for my app's 
                interactive features.
              </p>
            </div>

            {/* Backend - Lambda Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.awsLambda} alt="AWS Lambda" className="w-6 h-6 mr-2" />
                Backend - AWS Lambda Function (Python)
              </h4>
              <p>
                The backend processing is handled by an AWS Lambda function written in Python. This function powers 
                prompt engineering by handling requests, processing user inputs, and generating responses through 
                OpenAI integration, all within a serverless environment that scales with demand.
              </p>
            </div>

            {/* OpenAI Integration Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.openAI} alt="OpenAI" className="w-6 h-6 mr-2" />
                Interaction with OpenAI
              </h4>
              <p>
                By integrating with OpenAI's API, my Lambda function retrieves AI-generated responses to user prompts.
                This allows my project to showcase advanced NLP capabilities, providing dynamic, contextually relevant 
                responses that enrich user interaction.
              </p>
            </div>

            {/* DynamoDB Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.awsDynamoDB} alt="DynamoDB" className="w-6 h-6 mr-2" />
                Session Management - AWS DynamoDB
              </h4>
              <p>
                DynamoDB is used to store user session data, maintaining context across interactions. Its fast, scalable 
                NoSQL structure supports real-time data retrieval and ensures seamless user experiences even during peak usage.
              </p>
            </div>

            {/* Cognito Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.awsCognito} alt="Cognito" className="w-6 h-6 mr-2" />
                User Management - AWS Cognito
              </h4>
              <p>
                AWS Cognito handles user authentication and authorization, providing a secure login experience with 
                support for multi-factor authentication. This enables secure and compliant access control.
              </p>
            </div>

            {/* Code Hosting Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.github} alt="GitHub" className="w-6 h-6 mr-2" />
                Code Repository - GitHub
              </h4>
              <p>
                The project codebase is hosted on GitHub, allowing for easy version control, code reviews, and continuous 
                integration through GitHub Actions, facilitating a seamless development and deployment workflow.
              </p>
            </div>

            {/* Technologies Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.typescript} alt="TypeScript" className="w-6 h-6 mr-2" />
                <img src={logoUrls.javascript} alt="JavaScript" className="w-6 h-6 ml-2 mr-2" />
                <img src={logoUrls.python} alt="Python" className="w-6 h-6 ml-2 mr-2" />
                Technologies Used: TypeScript / JavaScript & Python
              </h4>
              <p>
                TypeScript enhances code quality and maintainability on the frontend, while JavaScript allows for flexible 
                interactions. Python powers backend processes, utilizing its simplicity and performance in the Lambda function.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
