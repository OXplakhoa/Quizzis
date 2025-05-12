"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { userQuizSchema } from "@/schemas/form/quizSchema";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

  const onSubmit = async (data: UserQuizForm, playAfterSave = false) => {
    setIsSaving(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      const res = await fetch("/api/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Lưu quiz thất bại");
      const { quizId } = await res.json();
      if (onSaved) onSaved(quizId);
      // TODO: Navigate to play page if playAfterSave is true
      if (playAfterSave) {
        window.location.href = `/play/mcq/${quizId}`;
      }
    } catch (e: any) {
      setError(e.message || "Đã có lỗi xảy ra");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="space-y-8"
      onSubmit={form.handleSubmit((data) => onSubmit(data, false))}
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Tiêu đề bài quiz"
          {...form.register("title")}
          className="text-lg font-semibold"
        />
        <Input
          placeholder="Chủ đề bài quiz"
          {...form.register("topic")}
        />
      </div>
      <div className="space-y-8">
        {fields.map((field, qIdx) => (
          <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Câu hỏi {qIdx + 1}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveQuestion(qIdx)}
                disabled={fields.length === 1}
              >
                Xóa
              </Button>
            </div>
            <Input
              placeholder="Nhập nội dung câu hỏi..."
              {...form.register(`questions.${qIdx}.question` as const)}
              className="mb-2"
            />
            <div className="space-y-2">
              {form.watch(`questions.${qIdx}.choices`).map((choice, cIdx) => (
                <div key={cIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={form.watch(`questions.${qIdx}.correctAnswer`) === cIdx}
                    onChange={() => form.setValue(`questions.${qIdx}.correctAnswer`, cIdx)}
                  />
                  <Input
                    placeholder={`Lựa chọn ${cIdx + 1}`}
                    {...form.register(`questions.${qIdx}.choices.${cIdx}` as const)}
                  />
                  {form.watch(`questions.${qIdx}.choices`).length > 2 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveChoice(qIdx, cIdx)}
                    >
                      Xóa
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
                >
                  Thêm lựa chọn
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button type="button" onClick={handleAddQuestion} variant="outline">
          Thêm câu hỏi
        </Button>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="flex gap-4 justify-center">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Đang lưu..." : "Lưu"}
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={isSaving}
          onClick={form.handleSubmit((data) => onSubmit(data, true))}
        >
          {isSaving ? "Đang lưu..." : "Lưu & Chơi ngay"}
        </Button>
      </div>
    </form>
  );
};

export default UserQuizCreation; 