import React, { ReactElement, useEffect, useRef, useState } from 'react';
import useCVStore from '../stores/cvStore';

const DynamicCV: React.FC = () => {
    const data = useCVStore((state) => state.data); // Access the CV data from Zustand
    const loading = useCVStore((state) => state.loading); // Access loading state
    const error = useCVStore((state) => state.error); // Access error state
    const loadCVDataFromPath = useCVStore((state) => state.loadCVDataFromPath); // Get the function to load data from the store
    const svgRef = useRef<SVGSVGElement>(null); // Reference for the SVG element
    const [svgHeight, setSvgHeight] = useState(800); // State to manage dynamic SVG height

    useEffect(() => {
        const url = '/cvData.json';
        loadCVDataFromPath(url);
    }, [loadCVDataFromPath]);

    useEffect(() => {
        // Adjust the height dynamically after rendering content
        if (svgRef.current) {
            const bbox = svgRef.current.getBBox();
            setSvgHeight(bbox.height + 20); // Add some extra padding for visibility
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading CV data: {error}</div>;
    }

    if (!data) {
        return <div>No data available.</div>;
    }

    const svgNamespace = "http://www.w3.org/2000/svg";
    const xMargin = 20;
    const spacing = 20;
    const maxWidth = 760; // Width available for text inside the SVG

    // Helper function to estimate text width (using canvas for measurement)
    const getTextWidth = (text: string, fontSize: number, fontWeight: string): number => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = `${fontWeight} ${fontSize}px Arial`;
            return context.measureText(text).width;
        }
        return 0;
    };

    // Helper function to create an SVG text element with word wrapping
    // Helper function to create an SVG text element with word wrapping
    const createWrappedTextElement = (
        text: string,
        x: number,
        y: number,
        fontSize = 14,
        fontWeight = 'normal',
        keyPrefix: string
    ) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        let lineIndex = 0;

        words.forEach((word) => {
            const testLine = currentLine + word + ' ';
            const testWidth = getTextWidth(testLine, fontSize, fontWeight);
            if (testWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine); // Add the last line

        return lines.map((line, index) => {
            const currentY = y + index * (fontSize + 4);
            return (
                <text
                    key={`${keyPrefix}-line-${lineIndex++}`}
                    x={x}
                    y={currentY}
                    fontFamily="Arial"
                    fontSize={fontSize}
                    fill="#2c3e50"
                    fontWeight={fontWeight}
                >
                    {line.trim()}
                </text>
            );
        });
    };

    // Render content
    const renderContent = () => {
        let yPosition = 20;
        const elements: ReactElement[] = [];

        // Helper to add a section title and increment y-position
        const addSectionTitle = (title: string) => {
            elements.push(...createWrappedTextElement(title, xMargin, yPosition, 20, 'bold', `section-title-${title}`));
            yPosition += spacing * 1.5;
        };

        // Helper to add individual items
        const addItem = (text: string, key: string) => {
            const wrappedText = createWrappedTextElement(text, xMargin, yPosition, 14, 'normal', key);
            elements.push(...wrappedText);
            yPosition += wrappedText.length * (14 + 4) + spacing / 2;
        };

        // Add each section with unique key prefixes
        addSectionTitle("Contact Details");
        addItem(data.contact.full_name, `contact-full-name`);
        addItem(data.contact.address, `contact-address`);
        addItem(`Phone: ${data.contact.phone_number}`, `contact-phone`);
        addItem(`Email: ${data.contact.email}`, `contact-email`);
        addItem(`LinkedIn: ${data.contact.linkedin}`, `contact-linkedin`);
        yPosition += spacing;

        addSectionTitle("Professional Summary");
        addItem(data.summary, `summary`);
        yPosition += spacing;

        addSectionTitle("Technical Skills");
        data.hard_skills.forEach((skill, index) => addItem(`- ${skill}`, `hard-skill-${index}`));
        yPosition += spacing;

        addSectionTitle("Soft Skills");
        data.soft_skills.forEach((skill, index) => addItem(`- ${skill}`, `soft-skill-${index}`));
        yPosition += spacing;

        addSectionTitle("Work Experience");
        data.software_experience.forEach((exp, index) => {
            elements.push(...createWrappedTextElement(exp.project_name, xMargin, yPosition, 16, 'bold', `software-exp-${index}`));
            yPosition += 16 + 4; // Adjust for the height of the title line
            addItem(`${exp.role} | ${exp.duration}`, `exp-role-${index}`);
            addItem(exp.description, `exp-description-${index}`);
            yPosition += spacing;
        });

        addSectionTitle("Business Experience");
        data.business_experience.forEach((exp, index) => {
            elements.push(...createWrappedTextElement(`${exp.role} at ${exp.company}`, xMargin, yPosition, 16, 'bold', `business-exp-${index}`));
            yPosition += 16 + 4;
            addItem(exp.duration, `business-duration-${index}`);
            exp.responsibilities.forEach((resp, idx) => addItem(`- ${resp}`, `business-responsibility-${index}-${idx}`));
            yPosition += spacing;
        });

        addSectionTitle("Academic Background");
        data.academic_background.forEach((edu, index) => {
            addItem(`${edu.degree}, ${edu.institution} (${edu.year_of_completion})`, `academic-${index}`);
            if (edu.additional_info) {
                addItem(edu.additional_info, `academic-additional-${index}`);
            }
            yPosition += spacing;
        });

        addSectionTitle("Certifications");
        data.certifications.forEach((cert, index) => {
            addItem(`${cert.name}, ${cert.institution} (${cert.year_of_completion})`, `cert-${index}`);
        });
        yPosition += spacing;

        addSectionTitle("Personality Traits");
        data.personality.forEach((trait, index) => addItem(`- ${trait}`, `personality-${index}`));
        yPosition += spacing;

        addSectionTitle("Personal Interests");
        data.personal_interests.forEach((interest, index) => addItem(`- ${interest}`, `interest-${index}`));
        yPosition += spacing;

        addSectionTitle("Languages");
        data.languages.forEach((lang, index) => {
            addItem(`${lang.language}: ${lang.proficiency}`, `language-${index}`);
        });
        yPosition += spacing;

        addSectionTitle("Achievements");
        data.achievements.forEach((achieve, index) => {
            addItem(`${achieve.title}: ${achieve.description}`, `achievement-${index}`);
        });
        yPosition += spacing;

        addSectionTitle("References");
        data.references.forEach((ref, index) => {
            addItem(`${ref.name} (${ref.relationship}) - ${ref.contact_information}`, `reference-${index}`);
        });
        yPosition += spacing;

        return elements;
    };

    // Render SVG
    return (
        <svg
            ref={svgRef}
            id="dynamic-cv"
            xmlns={svgNamespace}
            width="800"
            height={svgHeight}
            viewBox={`0 0 800 ${svgHeight}`}
        >
            {renderContent()}
        </svg>
    );
};

export default DynamicCV;
