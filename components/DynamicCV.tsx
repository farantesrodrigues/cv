import React, { useEffect, useRef, useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import useCVStore from '../stores/cvStore';
import { handleDownloadCV, renderContent } from '@/utils/cvHelpers';
import JsonView from '@uiw/react-json-view';
import { Switch } from '@headlessui/react';

interface DynamicCVModalProps {
    onClose: () => void;
}

const DynamicCVModal: React.FC<DynamicCVModalProps> = ({ onClose }) => {
    const data = useCVStore((state) => state.data);
    const loading = useCVStore((state) => state.loading);
    const error = useCVStore((state) => state.error);
    const loadCVDataFromPath = useCVStore((state) => state.loadCVDataFromPath);
    const svgRef = useRef<SVGSVGElement>(null);
    const [svgHeight, setSvgHeight] = useState(800);
    const cvRef = useRef<HTMLDivElement>(null);
    const [showJsonView, setShowJsonView] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const url = '/cvData.json';
        loadCVDataFromPath(url);
    }, [loadCVDataFromPath]);

    useEffect(() => {
        if (svgRef.current) {
            const bbox = svgRef.current.getBBox();
            setSvgHeight(bbox.height + 20);
        }
    }, [data, showJsonView]);

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

    // Toggle collapse/expand state
    const handleCollapseExpand = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-[800px] h-auto max-h-[90%] overflow-auto relative shadow-lg">
            
                {/* Toolbar */}
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center gap-4 z-50">
                    {/* Display mode switch */}
                    <Switch.Group as="div" className="flex items-center">
                        <Switch.Label className="mr-4 text-sm font-medium text-gray-700">
                            {showJsonView ? 'Show SVG View' : 'Show JSON View'}
                        </Switch.Label>
                        <Switch
                            checked={showJsonView}
                            onChange={setShowJsonView}
                            className={`${
                                showJsonView ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Toggle display mode</span>
                            <span
                                className={`${
                                    showJsonView ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                            />
                        </Switch>
                    </Switch.Group>

                    {/* Collapse/Expand Button with Icon and Tooltip */}
                    {showJsonView && (
                        <button
                            onClick={handleCollapseExpand}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="relative text-gray-600 hover:text-gray-800 flex items-center"
                            aria-label={isCollapsed ? "Expand All" : "Collapse All"}
                        >
                            {isCollapsed ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronUpIcon className="h-5 w-5" />}

                            {/* Tooltip positioned at the bottom */}
                            {showTooltip && (
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg">
                                    {isCollapsed ? "Expand All" : "Collapse All"}
                                </div>
                            )}
                        </button>
                    )}

                    {/* Download Button */}
                    <button
                        onClick={() => handleDownloadCV(cvRef.current!)}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="Download CV"
                    >
                        <ArrowDownTrayIcon className="h-6 w-6" />
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 ml-auto"
                        aria-label="Close Modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content Area */}
                <div ref={cvRef} className="cv-container p-4 z-40">
                    {showJsonView ? (
                        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                            <JsonView 
                                value={data} 
                                enableClipboard={false} 
                                displayDataTypes={false} 
                                displayObjectSize={true} 
                                collapsed={isCollapsed ? 1 : false} 
                                indentWidth={15} 
                                shortenTextAfterLength={360}
                            />
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default DynamicCVModal;
