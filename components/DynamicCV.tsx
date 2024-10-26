import React, { useEffect, useRef, useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import useCVStore from '../stores/cvStore';
import { handleDownloadCV, renderContent } from '@/utils/cvHelpers';

interface DynamicCVModalProps {
    onClose: () => void;
}

const DynamicCVModal: React.FC<DynamicCVModalProps> = ({ onClose }) => {
    const data = useCVStore((state) => state.data); // Access the CV data from Zustand
    const loading = useCVStore((state) => state.loading); // Access loading state
    const error = useCVStore((state) => state.error); // Access error state
    const loadCVDataFromPath = useCVStore((state) => state.loadCVDataFromPath); // Get the function to load data from the store
    const svgRef = useRef<SVGSVGElement>(null); // Reference for the SVG element
    const [svgHeight, setSvgHeight] = useState(800); // State to manage dynamic SVG height
    const cvRef = useRef<HTMLDivElement>(null); // Reference for the CV element

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

    // Render SVG
    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg w-[800px] h-auto max-h-[90%] overflow-auto relative">
            
            {/* Sticky Toolbar */}
            <div className="sticky top-0 bg-white p-4 border-b flex justify-end gap-4">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="Close Modal"
                    >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Download Button */}
                <button
                    onClick={() => handleDownloadCV(cvRef.current!)}
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="Download CV"
                    >
                    <ArrowDownTrayIcon className="h-6 w-6" />
                </button>

            </div>

            {/* Dynamic CV Component */}
            <div ref={cvRef} className="cv-container p-4">
                <svg
                    ref={svgRef}
                    id="dynamic-cv"
                    xmlns={svgNamespace}
                    width="800"
                    height={svgHeight}
                    viewBox={`0 0 800 ${svgHeight}`}
                >
                    {renderContent(data)}
                </svg>
            </div>
            </div>
        </div>

        
    );
};

export default DynamicCVModal;
