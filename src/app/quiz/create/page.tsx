import React from "react";
import UserQuizCreation from "@/components/UserQuizCreation";

const QuizCreatePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-2">
      <div className="bg-white rounded-lg shadow-lg p-2 w-full max-w-3xl">
        <UserQuizCreation />
      </div>
    </div>
  );
};

export default QuizCreatePage; 