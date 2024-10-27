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
    react: '/react-logo.png',
};

interface ProjectInfoModalProps {
  onClose: () => void;
}

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ onClose }) => {
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
                  When reimagining my CV, I aimed to create an <em>interactive</em> experience rather than a traditional document. 
                  This project became a chance to showcase <em>prompt engineering</em> and <em>cloud integration</em> in a recruitment tool that 
                  feels both fun and functional.
                  <br /><br />
                  The concept evolved into a chatbot that presents my experience dynamically, with <strong>login-protected access</strong> for selective 
                  sharing. It also includes exportable files for more formal discussions. This <em>not-a-cv</em> is both a creative portfolio 
                  and a platform to explore new tech.
                  <br /><br />
                  Time doesn’t stretch, so some ideas were set aside, like a <em>motivation letter generator</em>, design upgrades, integrating <u>data 
                  flows</u> from external sources, and even opening the app for public use.
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
                <img src={logoUrls.react} alt="React" className="w-6 h-6 mr-2" />
                <img src={logoUrls.awsS3} alt="AWS S3" className="w-6 h-6 ml-2 mr-2" />
                Frontend - React App on AWS S3
              </h4>
              <p>
                Built in <strong>TypeScript</strong>, the frontend is deployed as a static site to <strong>AWS S3</strong> for reliable, scalable hosting. 
                The production environment is routed through a custom domain on <strong>Route 53</strong> with HTTPS managed by AWS Certificate Manager.
              </p>
            </div>

            {/* API Gateway, Lambda and Dynamo DB Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.awsApiGateway} alt="API Gateway" className="w-6 h-6 mr-2" />
                <img src={logoUrls.awsLambda} alt="AWS Lambda" className="w-6 h-6 mr-2" />
                <img src={logoUrls.awsDynamoDB} alt="DynamoDB" className="w-6 h-6 mr-2" />
                Serverless Backend - API Gateway, Lambda, and DynamoDB
              </h4>
              <p>
                <strong>AWS API Gateway</strong> securely connects the frontend to serverless Lambda functions, which handle <strong>user authentication</strong> 
                and prompt generation. Three <em>JavaScript</em> functions manage token handling, and a <strong>Python</strong> function processes prompts and 
                OpenAI responses. <strong>User sessions</strong> and <strong>chat history</strong> are stored in <strong>DynamoDB</strong> to support context persistence across conversations.
              </p>
            </div>

            {/* OpenAI Integration Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.openAI} alt="OpenAI" className="w-6 h-6 mr-2" />
                Integration with OpenAI
              </h4>
              <p>
                The primary Lambda function calls the <em>OpenAI API</em> to generate responses. This interaction is guided by my <em>tailored prompt structure</em>, 
                enhancing the chatbot's conversational relevance and allowing nuanced replies that reflect my professional profile.
              </p>
            </div>

            {/* Cognito Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.awsCognito} alt="Cognito" className="w-6 h-6 mr-2" />
                User Authentication - AWS Cognito
              </h4>
              <p>
                <strong>AWS Cognito</strong> secures access by managing <em>authentication</em> and <em>authorization</em>. For controlled distribution, I manually create user profiles, 
                ensuring only intended audiences have access to my <u>“not a CV”</u> app.
              </p>
            </div>

            {/* Code Hosting Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.github} alt="GitHub" className="w-6 h-6 mr-2" />
                Code Repository - GitHub
              </h4>
              <p>
                All code is hosted on <strong>GitHub</strong>, aligning with professional practices for transparency, versioning, and review. While this is a personal project, 
                having a structured, accessible codebase invites others to explore and analyze it, potentially sparking interesting conversations.
              </p>
            </div>

            {/* Technologies Section */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <img src={logoUrls.typescript} alt="TypeScript" className="w-6 h-6 mr-2" />
                <img src={logoUrls.javascript} alt="JavaScript" className="w-6 h-6 ml-2 mr-2" />
                <img src={logoUrls.python} alt="Python" className="w-6 h-6 ml-2 mr-2" />
                Core Languages: TypeScript, JavaScript, & Python
              </h4>
              <p>
                I’m language agnostic, favoring languages that best fit the task at hand. For this project, <strong>React</strong> and <strong>TypeScript</strong> 
                create a structured and maintainable frontend with flexible interactions. <strong>Python</strong> was chosen for the backend Lambda functions 
                to minimize cognitive load, providing simplicity and efficiency in serverless processing. Together, these languages bring balance 
                to the project, supporting clarity, flexibility, and ease of future growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoModal;
