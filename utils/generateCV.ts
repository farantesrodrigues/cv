import jsPDF from 'jspdf';
import { loadImageAsBase64 } from './exportToPdf';

type Contact = {
    full_name: string;
    email: string;
    phone_number: string;
    linkedin: string;
};

type Experience = {
    project_name: string;
    description: string;
    technologies: string[];
    role: string;
    duration: string;
};

type Certification = {
    name: string;
    institution: string;
    year_of_completion: number;
};

type Achievement = {
    title: string;
    description: string;
};

type CVData = {
    contact: Contact;
    summary: string;
    hard_skills: string[];
    software_experience: Experience[];
    certifications: Certification[];
    achievements: Achievement[];
};

const loadCVData = async (): Promise<CVData> => {
    const response = await fetch("/cvData.json");
    if (!response.ok) {
        throw new Error('Failed to load CV data');
    }
    return await response.json() as CVData;
};

export const generatePDF = async () => {
    try {
        const cvData: CVData = await loadCVData();
        const doc: jsPDF = new jsPDF();
        const pageWidth: number = doc.internal.pageSize.getWidth();
        const pageHeight: number = doc.internal.pageSize.getHeight();
        const margin: number = 15;
        const contentWidth: number = pageWidth - margin * 2;
        let y: number = 30;

        // Load avatar
        const avatarBase64: string = await loadImageAsBase64("/my-avatar.webp");

        // Design Elements
        const primaryColor: [number, number, number] = [33, 150, 243];
        const fontTitleSize: number = 18;
        const fontSectionTitleSize: number = 13;
        const fontContentSize: number = 11;

        // Header Section - Contact Information
        doc.addImage(avatarBase64, 'PNG', margin, 10, 20, 20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontTitleSize);
        doc.text(cvData.contact.full_name, margin + 25, 20);
        doc.setFontSize(fontContentSize);
        doc.setFont('helvetica', 'normal');
        doc.text(`Email: ${cvData.contact.email}`, margin + 25, 28);
        doc.text(`Phone: ${cvData.contact.phone_number}`, margin + 25, 34);
        doc.text(`LinkedIn: ${cvData.contact.linkedin}`, margin + 25, 40);
        y = 50;

        // Summary Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSectionTitleSize);
        doc.setTextColor(...primaryColor);
        doc.text('Summary', margin, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontContentSize);
        doc.setTextColor(0, 0, 0);
        const wrappedSummary = doc.splitTextToSize(cvData.summary, contentWidth);
        wrappedSummary.forEach((line: string) => {
            doc.text(line, margin, y);
            y += 5;
        });
        y += 10;

        // Key Skills Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSectionTitleSize);
        doc.setTextColor(...primaryColor);
        doc.text('Key Skills', margin, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontContentSize);
        cvData.hard_skills.forEach((skill) => {
            doc.text(`- ${skill}`, margin, y);
            y += 5;
        });
        y += 10;

        // Professional Experience Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSectionTitleSize);
        doc.setTextColor(...primaryColor);
        doc.text('Professional Experience', margin, y);
        y += 8;

        cvData.software_experience.forEach((job: Experience) => {
            doc.setFontSize(fontContentSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(`${job.project_name} - ${job.role}`, margin, y);
            y += 6;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(fontContentSize);
            doc.text(`${job.duration}`, margin, y);
            y += 5;

            const wrappedDescription = doc.splitTextToSize(job.description, contentWidth);
            wrappedDescription.forEach((line: string) => {
                doc.text(line, margin, y);
                y += 5;
            });

            y += 8; // Add spacing between jobs
        });

        // Certifications Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSectionTitleSize);
        doc.setTextColor(...primaryColor);
        doc.text('Certifications', margin, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        cvData.certifications.forEach((cert: Certification) => {
            doc.text(`- ${cert.name} by ${cert.institution}, ${cert.year_of_completion}`, margin, y);
            y += 5;
        });
        y += 10;

        // Achievements Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSectionTitleSize);
        doc.setTextColor(...primaryColor);
        doc.text('Achievements', margin, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        cvData.achievements.forEach((ach: Achievement) => {
            doc.text(`- ${ach.title}: ${ach.description}`, margin, y);
            y += 5;
        });

        // Save the PDF
        doc.save("francisco_arantes_cv.pdf");
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};
