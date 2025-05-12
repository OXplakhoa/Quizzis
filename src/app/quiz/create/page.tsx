import React from "react";
import UserQuizCreation from "@/components/UserQuizCreation";

const QuizCreatePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Tạo bài Quiz trắc nghiệm của bạn</h1>
        <UserQuizCreation />
      </div>
    </div>
  );
};

export default QuizCreatePage; 