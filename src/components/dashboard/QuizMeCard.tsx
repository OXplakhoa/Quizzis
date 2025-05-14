"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BrainCircuit, ArrowLeft, FileText, Presentation, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {};

const QuizMeCard = (props: Props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
        setShowImportOptions(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);
  
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
            {!showImportOptions ? (
              <>
                <h2 className="text-xl font-bold mb-4">Tạo một bài Quiz mới</h2>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* Import Content Option */}
                  <button 
                    className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer"
                    onClick={() => setShowImportOptions(true)}
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
                    className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer"
                    onClick={() => {
                      setShowModal(false); 
                      router.push("/quiz");
                    }}
                  >
                    <div className="bg-purple-500 text-white p-2 rounded-full mr-3">
                      <BrainCircuit size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Quizzis Generator</div>
                      <span className="text-xs text-gray-600">AI assisted</span>
                    </div>
                  </button>
                  
                  {/* Blank Canvas Option */}
                  <button
                    className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer"
                    onClick={() => {
                      setShowModal(false);
                      router.push("/quiz/create");
                    }}
                  >
                    <div className="bg-green-500 text-white p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Blank Canvas</div>
                      <span className="text-xs text-gray-600">Create from scratch</span>
                    </div>
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
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold">Import Options</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* PDF to Quizzis Option */}
                  <button 
                    className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer"
                    onClick={() => {
                      setShowModal(false);
                      // TODO: Add your PDF import navigation
                      router.push("/quiz/import?type=pdf");
                    }}
                  >
                    <div className="bg-red-500 text-white p-2 rounded-full mr-3">
                      <FileText size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">PDF to Quizzis</div>
                      <span className="text-xs text-gray-600">Extract content from PDF</span>
                    </div>
                  </button>
                  
                  {/* Import Slides Option */}
                  <button 
                    className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex items-center hover:cursor-pointer"
                    onClick={() => {
                      setShowModal(false);
                      // TODO: Add your slides import navigation
                      router.push("/quiz/import?type=slides");
                    }}
                  >
                    <div className="bg-orange-500 text-white p-2 rounded-full mr-3">
                      <Presentation size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Import Slides</div>
                      <span className="text-xs text-gray-600">Upload your slides</span>
                    </div>
                  </button>
                </div>
              </>
            )}
            
            <button 
              className="mt-2 w-full py-2 rounded bg-gray-200 hover:bg-gray-300 hover:cursor-pointer" 
              onClick={() => {
                setShowModal(false);
                setShowImportOptions(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizMeCard;