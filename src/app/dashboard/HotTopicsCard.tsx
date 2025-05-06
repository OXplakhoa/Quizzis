import CustomWordCloud from "@/components/CustomWordCloud";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

type Props = {};

const HotTopicsCard = (props: Props) => {
  return (
    <Card className="col-span-4 hover:cursor-pointer hover:opacity-80 transition-all duration-200 ease-in-out bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-1.5">
          Các chủ đề HOT 🔥❤️‍🔥
        </CardTitle>
        <CardDescription className="text-white">
          Chọn 1 chủ đề để bắt đầu bài trắc nghiệm!
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <CustomWordCloud />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
