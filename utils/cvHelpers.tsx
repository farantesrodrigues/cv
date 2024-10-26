import { CVData } from '@/stores/cvStore';
import { ReactElement } from 'react';

  
export const handleDownloadCV = (cvDiv: HTMLDivElement) => {
    if (!cvDiv) {
        console.error('CV div element not found');
        return;
    }

    // Customize the options for html2pdf
    const options = {
        margin: [6, 0],
        filename: 'francisco_arantes_cv.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
        scale: 2, // Improve resolution for higher quality
        useCORS: true, // Enables cross-origin support if needed
        },
        jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        },
        pagebreak: {
        mode: ['css'],
        before: 'can-break'
        }
    };

    // @ts-expect-error('missing typings in html2pdf')
    import('html2pdf.js').then((html2pdf: Module) => {
        html2pdf.default().set(options).from(cvDiv).toPdf().save();
    });
};

const xMargin = 20;
const defaultTextSize = 14;
const defaultTitleSize = Math.floor(defaultTextSize * 1.4);
const spacing = Math.floor(defaultTextSize * 1.2);
const sectionSpacer = defaultTitleSize;
const maxWidth = 740; // Width available for text inside the SVG

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
const createWrappedTextElement = (
    text: string,
    x: number,
    y: number,
    fontSize = defaultTextSize,
    fontWeight = 'normal',
    keyPrefix: string,
    canBreak: boolean = false
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
        const currentY = y + index * (Math.floor(fontSize * 1.1));
        return (
            <text
                key={`${keyPrefix}-line-${lineIndex++}`}
                x={x}
                y={currentY}
                fontFamily="Arial"
                fontSize={fontSize}
                fill="#2c3e50"
                fontWeight={fontWeight}
                className={canBreak ? 'can-break' : ''}
            >
                {line.trim()}
            </text>
        );
    });
};

  // Render content
  export const renderContent = (data: CVData) => {
      let yPosition = spacing;
      const elements: ReactElement[] = [];

      // Helper to add a section title and increment y-position
      const addSectionTitle = (title: string) => {
          elements.push(...createWrappedTextElement(`// ${title}`, xMargin, yPosition, defaultTitleSize, 'bold', `section-title-${title}`, true));
          yPosition += defaultTitleSize * 1.2;
      };

      // Helper to add individual items
      const addItem = (text: string, key: string) => {
          const wrappedText = createWrappedTextElement(text, xMargin, yPosition, defaultTextSize, 'normal', key);
          elements.push(...wrappedText);
          yPosition += wrappedText.length * Math.floor(defaultTextSize * 1.2) + spacing / 2;
      };

      const addListItem = (text: string, key: string) => {
          const wrappedText = createWrappedTextElement(text, xMargin, yPosition, defaultTextSize, 'normal', key);
          elements.push(...wrappedText);
          yPosition += wrappedText.length * Math.floor(defaultTextSize * 1.2);
      };

      // Add each section with unique key prefixes
      addSectionTitle("Contact Details");
      addListItem(data.contact.full_name, `contact-full-name`);
      addListItem(data.contact.address, `contact-address`);
      addListItem(`Phone: ${data.contact.phone_number}`, `contact-phone`);
      addListItem(`Email: ${data.contact.email}`, `contact-email`);
      addListItem(`LinkedIn: ${data.contact.linkedin}`, `contact-linkedin`);
      yPosition += sectionSpacer;

      addSectionTitle("Professional Summary");
      addItem(data.summary, `summary`);
      yPosition += sectionSpacer;

      addSectionTitle("Technical Skills");
      data.hard_skills.forEach((skill, index) => addListItem(`- ${skill}`, `hard-skill-${index}`));
      yPosition += sectionSpacer;

      addSectionTitle("Soft Skills");
      data.soft_skills.forEach((skill, index) => addListItem(`- ${skill}`, `soft-skill-${index}`));
      yPosition += sectionSpacer;

      addSectionTitle("Work Experience");
      yPosition += spacing * 1.3;
      data.software_experience.forEach((exp, index) => {
          elements.push(...createWrappedTextElement(exp.project_name, xMargin, yPosition, Math.floor(defaultTextSize * 1.3), 'bold', `software-exp-${index}`));
          yPosition += spacing * 1.3;
          addItem(`${exp.role} | ${exp.duration}`, `exp-role-${index}`);
          addItem(exp.description, `exp-description-${index}`);
          yPosition += sectionSpacer;
      });

      addSectionTitle("Business Experience");
      yPosition += spacing * 1.3;
      data.business_experience.forEach((exp, index) => {
          elements.push(...createWrappedTextElement(`${exp.role} at ${exp.company}`, xMargin, yPosition, Math.floor(defaultTextSize * 1.3), 'bold', `business-exp-${index}`));
          yPosition += Math.floor(spacing * 1.3);
          addItem(exp.duration, `business-duration-${index}`);
          addItem(exp.responsibilities.join(" "), `business-responsibility-${index}`);
          yPosition += sectionSpacer;
      });

      addSectionTitle("Academic Background");
      data.academic_background.forEach((edu, index) => {
          addItem(`${edu.degree}, ${edu.institution} (${edu.year_of_completion})`, `academic-${index}`);
      });
      yPosition += sectionSpacer;

      addSectionTitle("Certifications");
      data.certifications.forEach((cert, index) => {
          addListItem(`${cert.name}, ${cert.institution} (${cert.year_of_completion})`, `cert-${index}`);
      });
      yPosition += sectionSpacer;

      addSectionTitle("Personality Traits");
      data.personality.forEach((trait, index) => addListItem(`- ${trait}`, `personality-${index}`));
      yPosition += sectionSpacer;

      addSectionTitle("Personal Interests");
      data.personal_interests.forEach((interest, index) => addListItem(`- ${interest}`, `interest-${index}`));
      yPosition += sectionSpacer;

      addSectionTitle("Languages");
      data.languages.forEach((lang, index) => {
          addListItem(`${lang.language}: ${lang.proficiency}`, `language-${index}`);
      });
      yPosition += sectionSpacer;

      addSectionTitle("References");
      data.references.forEach((ref, index) => {
          addItem(`${ref.name} (${ref.relationship}) - ${ref.contact_information}`, `reference-${index}`);
      });

      return elements;
  };