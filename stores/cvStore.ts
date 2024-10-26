import { create } from 'zustand';

export interface CVData {
    contact: ContactInfo;
    summary: string;
    hard_skills: string[];
    soft_skills: string[];
    software_experience: WorkExperience[];
    business_experience: BusinessExperience[];
    academic_background: AcademicBackground[];
    certifications: Certification[];
    personality: string[];
    personal_interests: string[];
    languages: Language[];
    achievements: Achievement[];
    references: Reference[];
}

interface ContactInfo {
    full_name: string;
    address: string;
    phone_number: string;
    email: string;
    linkedin: string;
}

interface WorkExperience {
    project_name: string;
    description: string;
    technologies: string[];
    role: string;
    duration: string;
}

interface BusinessExperience {
    role: string;
    company: string;
    duration: string;
    responsibilities: string[];
}

interface AcademicBackground {
    degree: string;
    institution: string;
    year_of_completion: number;
    additional_info?: string;
}

interface Certification {
    name: string;
    institution: string;
    year_of_completion: number;
}

interface Language {
    language: string;
    proficiency: string;
}

interface Achievement {
    title: string;
    description: string;
}

interface Reference {
    name: string;
    relationship: string;
    contact_information: string;
}

interface CVStore {
  data: CVData | null;
  loading: boolean;
  error: string | null;
  loadCVDataFromPath: (url: string) => Promise<void>;
}

const useCVStore = create<CVStore>((set) => ({
  data: null,
  loading: false,
  error: null,

  loadCVDataFromPath: async (url: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CVData = await response.json();
      
      set({ data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

export default useCVStore;