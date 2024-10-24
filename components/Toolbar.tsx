import { ArrowDownTrayIcon, ArrowLeftEndOnRectangleIcon, DocumentTextIcon, CodeBracketIcon, ChatBubbleBottomCenterTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/router';

interface ToolbarProps {
  exportChat: () => void;
  downloadCV: () => void;
  visitSourceCode: () => void;
  addPreparedPrompt: (prompt: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ exportChat, downloadCV, visitSourceCode, addPreparedPrompt }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const router = useRouter();
    const clearTokens = useAuthStore((state) => state.clearTokens);

    // Software Development Prompts
    const softwarePrompts: string[] = [
      "Tell me about your experience in software development.",
      "What projects have you worked on in the banking sector?",
      "Can you describe your role in the National Bank of Belgium's Cash 2 project?",
      "What kind of freelance projects have you completed?",
      "Which technologies have you used for web development?",
    ];
  
    // Management Prompts
    const managementPrompts: string[] = [
      "Tell me about your experience in management.",
      "What roles have you had in marketing or sales?",
      "Describe a project where you led a team.",
      "What kind of responsibilities did you have as a Sales Director at Tecipa?",
      "Can you explain your role at L'OREAL as a Junior Zone Coordinator?",
    ];
  
    // Skills Prompts
    const skillsPrompts: string[] = [
      "What are your key technical skills?",
      "Which programming languages are you most proficient in?",
      "Tell me about your experience with cloud platforms like AWS.",
      "What tools and platforms have you worked with for CI/CD?",
      "How proficient are you in Python or JavaScript?",
    ];
  
    // Academic Prompts
    const academicPrompts: string[] = [
      "Can you tell me about your academic background?",
      "What degrees do you hold and from which universities?",
      "Did you study anything related to economics?",
      "What was your academic journey like before becoming a software developer?",
    ];
  
    // Hobbies and Interests Prompts
    const hobbiesPrompts: string[] = [
      "What do you do outside of work?",
      "Do you have any hobbies or personal interests?",
      "Tell me about your passion for mountaineering.",
      "What role does tennis play in your life?",
    ];
  
    // Toggle dropdown visibility
    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };

    // Handle selecting a prompt
    const handlePromptSelect = (prompt: string) => {
      addPreparedPrompt(prompt); // Call the function passed from ChatBot to handle the prepared prompt
      setDropdownVisible(false); // Close the dropdown after selecting a prompt
    };
    
    // Handle logout
    const handleLogout = async () => {
      await clearTokens();
      router.push('/');
    };

    return (
        <div className="flex justify-center items-center p-4 border-b bg-white shadow-sm">
          {/* Button group container */}
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1 border border-gray-300 shadow-sm relative">
            
            {/* Export Chat to PDF Button */}
            <button
              onClick={exportChat}
              className="relative group flex items-center p-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <DocumentTextIcon className="w-5 h-5 text-gray-700" />
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-max p-2 rounded-md text-xs text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Export Chat to PDF
              </span>
            </button>
    
            {/* Download CV Button */}
            <button
              onClick={downloadCV}
              className="relative group flex items-center p-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <ArrowDownTrayIcon className="w-5 h-5 text-gray-700" />
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-max p-2 rounded-md text-xs text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Download CV
              </span>
            </button>
    
            {/* Visit Source Code Button */}
            <button
              onClick={visitSourceCode}
              className="relative group flex items-center p-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <CodeBracketIcon className="w-5 h-5 text-gray-700" />
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-max p-2 rounded-md text-xs text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Visit Source Code
              </span>
            </button>
    
            {/* Prepared Prompts Dropdown Button */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center p-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-gray-700" />
                <ChevronDownIcon className="w-4 h-4 text-gray-700 ml-1" />
              </button>
    
                {/* Dropdown Menu */}
                {dropdownVisible && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2 space-y-2 max-h-[36rem] overflow-y-auto">
                    {/* Software Development Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Software Development</h3>
                        {softwarePrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handlePromptSelect(prompt)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {prompt}
                        </button>
                        ))}
                    </div>

                    {/* Management Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Management</h3>
                        {managementPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handlePromptSelect(prompt)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {prompt}
                        </button>
                        ))}
                    </div>

                    {/* Skills Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Skills</h3>
                        {skillsPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handlePromptSelect(prompt)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {prompt}
                        </button>
                        ))}
                    </div>

                    {/* Academic Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Academic</h3>
                        {academicPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handlePromptSelect(prompt)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {prompt}
                        </button>
                        ))}
                    </div>

                    {/* Hobbies and Interests Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Hobbies & Interests</h3>
                        {hobbiesPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handlePromptSelect(prompt)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {prompt}
                        </button>
                        ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="relative group flex items-center p-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <ArrowLeftEndOnRectangleIcon className="w-5 h-5 text-gray-700" />
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-max p-2 rounded-md text-xs text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Logout
              </span>
            </button>
          </div>
        </div>
      );
    };
    
    export default Toolbar;