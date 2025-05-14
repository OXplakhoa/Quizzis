"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BrainCircuit, ArrowLeft, FileText, Presentation, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import FileUpload from "../FileUpload";
import axios from "axios";
import { toast } from "sonner";

type Props = {};

const QuizMeCard = (props: Props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [fileType, setFileType] = useState<'pdf' | 'pptx'>('pdf');
  const [animatingOption, setAnimatingOption] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
        setShowImportOptions(false);
        setShowFileUpload(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = fileType === 'pdf' ? '/api/quiz/parse-pdf' : '/api/quiz/parse-pptx';
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.quizId) {
        router.push(`/quiz/create?quizId=${response.data.quizId}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to process file');
    }
  };
  
  // Handle navigation with animation
  const handleOptionClick = (route: string, optionName: string) => {
    setAnimatingOption(optionName);
    
    // Delay navigation to allow animation to play
    setTimeout(() => {
      setShowModal(false);
      setAnimatingOption(null);
      router.push(route);
    }, 500); // 500ms animation duration
  };

  const handleImportClick = (type: 'pdf' | 'pptx') => {
    setFileType(type);
    setShowFileUpload(true);
  };
  
  return (
    <>
      <Card
        className="hover:cursor-pointer hover:opacity-80 transition-all duration-200 ease-in-out bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/50"
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-bold">Quiz Tôi</CardTitle>
          <BrainCircuit size={28} strokeWidth={2.5} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-100">
            Thử thách bản thân với những câu hỏi trắc nghiệm thú vị và hấp dẫn!
          </p>
        </CardContent>
      </Card>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl" ref={modalRef}>
            {showFileUpload ? (
              <FileUpload
                fileType={fileType}
                onUpload={handleFileUpload}
                onClose={() => {
                  setShowFileUpload(false);
                  setShowImportOptions(true);
                }}
              />
            ) : !showImportOptions ? (
              <>
                <h2 className="text-xl font-bold mb-4">Tạo một bài Quiz mới</h2>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* Import Content Option */}
                  <button 
                    className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer transition-all duration-200"
                    onClick={() => setShowImportOptions(true)}
                    disabled={animatingOption !== null}
                  >
                    <div className="bg-blue-500 text-white p-2 rounded-full mr-3">
                      <Upload size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Import Content</div>
                      <span className="text-xs text-gray-600">Import from PDF or slides</span>
                    </div>
                  </button>
                  
                  {/* Quizzis Generator Option */}
                  <button 
                    className={`relative bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer transition-all duration-200 overflow-hidden
                      ${animatingOption === 'generator' ? 'scale-105 shadow-lg' : ''}`}
                    onClick={() => handleOptionClick("/quiz", "generator")}
                    disabled={animatingOption !== null}
                  >
                    <div className="bg-purple-500 text-white p-2 rounded-full mr-3 z-10">
                      <BrainCircuit size={20} />
                    </div>
                    <div className="text-left z-10">
                      <div className="font-medium">Quizzis Generator</div>
                      <span className="text-xs text-gray-600">AI assisted</span>
                    </div>
                    {animatingOption === 'generator' && (
                      <div className="absolute inset-0 bg-purple-400 bg-opacity-30 animate-pulse-wave"></div>
                    )}
                  </button>
                  
                  {/* Blank Canvas Option */}
                  <button
                    className={`relative bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer transition-all duration-200 overflow-hidden
                      ${animatingOption === 'blank' ? 'scale-105 shadow-lg' : ''}`}
                    onClick={() => handleOptionClick("/quiz/create", "blank")}
                    disabled={animatingOption !== null}
                  >
                    <div className="bg-green-500 text-white p-2 rounded-full mr-3 z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left z-10">
                      <div className="font-medium">Blank Canvas</div>
                      <span className="text-xs text-gray-600">Create from scratch</span>
                    </div>
                    {animatingOption === 'blank' && (
                      <div className="absolute inset-0 bg-green-400 bg-opacity-30 animate-pulse-wave"></div>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Import Options Submenu */}
                <div className="mb-4 flex items-center">
                  <button 
                    onClick={() => setShowImportOptions(false)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    disabled={animatingOption !== null}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold">Import Options</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* PDF to Quizzis Option */}
                  <button 
                    className={`relative bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer transition-all duration-200 overflow-hidden
                      ${animatingOption === 'pdf' ? 'scale-105 shadow-lg' : ''}`}
                    onClick={() => handleImportClick('pdf')}
                    disabled={animatingOption !== null}
                  >
                    <div className="bg-red-500 text-white p-2 rounded-full mr-3 z-10">
                      <FileText size={20} />
                    </div>
                    <div className="text-left z-10">
                      <div className="font-medium">PDF to Quizzis</div>
                      <span className="text-xs text-gray-600">Extract content from PDF</span>
                    </div>
                    {animatingOption === 'pdf' && (
                      <div className="absolute inset-0 bg-red-400 bg-opacity-30 animate-pulse-wave"></div>
                    )}
                  </button>
                  
                  {/* Import Slides Option */}
                  <button 
                    className={`relative bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer transition-all duration-200 overflow-hidden
                      ${animatingOption === 'slides' ? 'scale-105 shadow-lg' : ''}`}
                    onClick={() => handleImportClick('pptx')}
                    disabled={animatingOption !== null}
                  >
                    <div className="bg-orange-500 text-white p-2 rounded-full mr-3 z-10">
                      <Presentation size={20} />
                    </div>
                    <div className="text-left z-10">
                      <div className="font-medium">Import Slides</div>
                      <span className="text-xs text-gray-600">Upload your slides</span>
                    </div>
                    {animatingOption === 'slides' && (
                      <div className="absolute inset-0 bg-orange-400 bg-opacity-30 animate-pulse-wave"></div>
                    )}
                  </button>
                </div>
              </>
            )}
            
            <button 
              className="mt-2 w-full py-2 rounded bg-gray-200 hover:bg-gray-300 hover:cursor-pointer" 
              onClick={() => {
                setShowModal(false);
                setShowImportOptions(false);
                setShowFileUpload(false);
              }}
              disabled={animatingOption !== null}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add the animation keyframes to the global styles */}
      <style jsx global>{`
        @keyframes pulse-wave {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }
        
        .animate-pulse-wave {
          animation: pulse-wave 0.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default QuizMeCard;