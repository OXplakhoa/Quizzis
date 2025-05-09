"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { quizSchema } from "@/schemas/form/quizSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, CopyCheck, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

type Input = z.infer<typeof quizSchema>;

const QuizCreation = (props: Props) => {
  const router = useRouter();
  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const res = await axios.post("/api/game", { amount, topic, type });
      return res.data;
    },
  });
  const form = useForm<Input>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      amount: 3,
      topic: "",
      type: "mcq",
    },
  });

  const onSubmit = (input: Input) => {
    getQuestions(
      {
        amount: input.amount,
        topic: input.topic,
        type: input.type,
      },
      {
        onSuccess: ({ gameId }) => {
          if (form.getValues("type") === "mcq") {
            router.push(`/play/mcq/${gameId}`);
          } else {
            router.push(`/play/open-ended/${gameId}`);
          }
        },
      }
    );
  };
  form.watch();
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Tạo bài trắc nghiệm
          </CardTitle>
          <CardDescription>Chọn chủ đề</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chủ đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập chủ đề..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Xin hãy cung cấp một chủ đề cho bài thi của bạn.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng câu hỏi</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập số lượng..."
                        type="number"
                        min={1}
                        max={10}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => form.setValue("type", "mcq")}
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                >
                  <CopyCheck className="h-4 w-4 mr-2" /> Trắc Nghiệm
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  onClick={() => form.setValue("type", "open_ended")}
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Tự luận
                </Button>
              </div>
              <Button disabled={isPending} type="submit">
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
