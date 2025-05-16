"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { userQuizSchema } from "@/schemas/form/quizSchema";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Save, Play } from "lucide-react";

const defaultQuestion = () => ({
  question: "",
  choices: ["", ""],
  correctAnswer: 0,
});

type UserQuizForm = z.infer<typeof userQuizSchema>;

type Props = {
  onSaved?: (quizId: string) => void;
};

const UserQuizCreation: React.FC<Props> = ({ onSaved }) => {
  const form = useForm<UserQuizForm>({
    resolver: zodResolver(userQuizSchema),
    defaultValues: {
      title: "",
      topic: "",
      questions: [defaultQuestion()],
    },
    mode: "onChange",
  });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "questions",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddQuestion = () => {
    append(defaultQuestion());
  };

  const handleRemoveQuestion = (idx: number) => {
    if (fields.length > 1) remove(idx);
  };

  const handleAddChoice = (qIdx: number) => {
    const q = form.getValues(`questions.${qIdx}`);
    if (q.choices.length < 4) {
      update(qIdx, { ...q, choices: [...q.choices, ""] });
    }
  };

  const handleRemoveChoice = (qIdx: number, cIdx: number) => {
    const q = form.getValues(`questions.${qIdx}`);
    if (q.choices.length > 2) {
      const newChoices = q.choices.filter((_, i) => i !== cIdx);
      let correctAnswer = q.correctAnswer;
      if (correctAnswer >= newChoices.length) correctAnswer = 0;
      update(qIdx, { ...q, choices: newChoices, correctAnswer });
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const endpoint = file.name.toLowerCase().endsWith(".pdf")
        ? "/api/quiz/parse-pdf"
        : "/api/quiz/parse-pptx";

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to parse file");
      }

      const data = await res.json();
      
      // Update form with parsed data
      form.reset({
        title: data.title,
        topic: data.topic,
        questions: data.questions,
      });

      toast.success("File parsed successfully");
    } catch (e: any) {
      setError(e.message || "Failed to parse file");
      toast.error("Failed to parse file");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: UserQuizForm, playAfterSave = false) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Lưu quiz thất bại");
      const { quizId } = await res.json();
      if (onSaved) onSaved(quizId);
      if (playAfterSave) {
        window.location.href = `/play/mcq/${quizId}`;
      }
      toast.success("Quiz đã được lưu thành công!");
    } catch (e: any) {
      setError(e.message || "Đã có lỗi xảy ra");
      toast.error("Không thể lưu quiz. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
      <form
        className="space-y-8 max-w-2xl w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
        onSubmit={form.handleSubmit((data) => onSubmit(data, false))}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white opacity-80">
          Tạo bài quiz trắc nghiệm của riêng bạn
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Tiêu đề bài quiz"
            {...form.register("title")}
            className="text-lg font-semibold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
          <Input
            placeholder="Chủ đề bài quiz"
            {...form.register("topic")}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        <div className="space-y-8">
          {fields.map((field, qIdx) => (
            <div 
              key={field.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  Câu hỏi {qIdx + 1}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  disabled={fields.length === 1}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </Button>
              </div>
              <Input
                placeholder="Nhập nội dung câu hỏi..."
                {...form.register(`questions.${qIdx}.question` as const)}
                className="mb-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
              <div className="space-y-3">
                {form.watch(`questions.${qIdx}.choices`).map((choice, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={form.watch(`questions.${qIdx}.correctAnswer`) === cIdx}
                      onChange={() => form.setValue(`questions.${qIdx}.correctAnswer`, cIdx)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <Input
                      placeholder={`Lựa chọn ${cIdx + 1}`}
                      {...form.register(`questions.${qIdx}.choices.${cIdx}` as const)}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                    {form.watch(`questions.${qIdx}.choices`).length > 2 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveChoice(qIdx, cIdx)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {form.watch(`questions.${qIdx}.choices`).length < 4 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAddChoice(qIdx)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm lựa chọn
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button 
            type="button" 
            onClick={handleAddQuestion} 
            variant="outline"
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm câu hỏi
          </Button>
        </div>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button 
            type="submit" 
            disabled={isSaving || isUploading}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button
            type="button"
            variant="default"
            disabled={isSaving || isUploading}
            onClick={form.handleSubmit((data) => onSubmit(data, true))}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Play className="w-4 h-4" />
            {isSaving ? "Đang lưu..." : "Lưu & Chơi ngay"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserQuizCreation; 