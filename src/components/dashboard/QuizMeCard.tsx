"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {};

const QuizMeCard = (props: Props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
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
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Tạo một bài Quiz mới</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex flex-col items-center hover:cursor-pointer" onClick={() => {/* TODO: PDF to Quizzis */}}>
                PDF to Quizzis
                <span className="text-xs mt-1">AI assisted</span>
              </button>
              <button className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex flex-col items-center hover:cursor-pointer" onClick={() => {setShowModal(false); router.push("/quiz");}}>
                Quizzis Generator
                <span className="text-xs mt-1">AI assisted</span>
              </button>
              <button
                className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex flex-col items-center hover:cursor-pointer"
                onClick={() => {
                  setShowModal(false);
                  // TODO: Navigate to the quiz builder full-page route
                  router.push("/quiz/create");
                }}
              >
                Blank canvas
                <span className="text-xs mt-1">Create from scratch</span>
              </button>
              <button className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 flex flex-col items-center hover:cursor-pointer" onClick={() => {/* TODO: Import Slides */}}>
                Import slides
                <span className="text-xs mt-1">Upload your slides</span>
              </button>
            </div>
            <button className="mt-2 w-full py-2 rounded bg-gray-200 hover:bg-gray-300 hover:cursor-pointer" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizMeCard;
