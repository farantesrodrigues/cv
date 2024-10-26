import { ArrowDownTrayIcon, ArrowLeftEndOnRectangleIcon, DocumentTextIcon, CodeBracketIcon, ChatBubbleBottomCenterTextIcon, ChevronDownIcon, UserGroupIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/router';

interface ToolbarProps {
  exportChat: () => void;
  downloadCV: () => void;
  visitSourceCode: () => void;
  visitLinkedIn: () => void;
  addPreparedPrompt: (prompt: string) => void;
  showProjectInfo: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ exportChat, downloadCV, visitSourceCode, visitLinkedIn, addPreparedPrompt, showProjectInfo }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const clearTokens = useAuthStore((state) => state.clearTokens);

    // Software Development Prompts
    const softwarePrompts: string[] = [
      "Can you share your experience in software development, including some of the projects you've worked on?",
      "What roles have you typically taken on in software projects, and what were your main responsibilities?",
      "Which technologies and tools have you commonly used in your development work?"
    ];

    // Management Prompts
    const managementPrompts: string[] = [
      "Tell me about your management and leadership experience, including roles in marketing, sales, and team management.",
      "Can you share an example of a project where you led a team and drove successful outcomes?"
    ];

    // Skills Prompts
    const skillsPrompts: string[] = [
      "What are your core technical skills, and which programming languages do you excel in?",
      "How have you utilized your skills in data modelling, automation, or software testing?"
    ];

    // Academic Prompts
    const academicPrompts: string[] = [
      "Can you discuss your academic background, including your degrees and any relevant coursework?",
      "How did your studies in economics influence your career path as a software developer?",
    ];

    // Hobbies and Interests Prompts
    const hobbiesPrompts: string[] = [
      "What hobbies and personal interests do you pursue outside of work?",
      "How do your cultural and international experiences shape your professional and personal growth?"
    ];
  
    // Toggle dropdown visibility
    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };

    // Close dropdown on click outside or after a timer
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownVisible(false);
        }
      };
      if (dropdownVisible) {
        document.addEventListener('mousedown', handleClickOutside);
        const timer = setTimeout(() => setDropdownVisible(false), 5000); // Auto-close after 5 seconds
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          clearTimeout(timer);
        };
      }
    }, [dropdownVisible]);

    // Handle logout
    const handleLogout = async () => {
      await clearTokens();
      router.push('/');
    };

    // Handle selecting a prompt
    const handlePromptSelect = (prompt: string) => {
      addPreparedPrompt(prompt); // Call the function passed from ChatBot to handle the prepared prompt
      setDropdownVisible(false); // Close the dropdown after selecting a prompt
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
    
            {/* Visit LinkedIn Button */}
            <button
              onClick={visitLinkedIn}
              className="relative group flex items-center p-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <UserGroupIcon className="w-5 h-5 text-gray-700" />
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-max p-2 rounded-md text-xs text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Visit LinkedIn
              </span>
            </button>
    
            {/* Prepared Prompts Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
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
    
            {/* Download CV Button */}
            <button
              onClick={showProjectInfo}
              className="relative group flex items-center p-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <InformationCircleIcon className="w-5 h-5 text-gray-700" />
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-max p-2 rounded-md text-xs text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Project Info
              </span>
            </button>

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