"use client";
import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";
import { text } from "stream/consumers";
type Props = {};

const data = [
  {
    text: "React",
    value: 3,
  },
  {
    text: "Node",
    value: 5,
  },
  {
    text: "JS",
    value: 6,
  },
  {
    text: "Vue",
    value: 9,
  },
  {
    text: "HTML",
    value: 6,
  },
  {
    text: "CSS",
    value: 7,
  },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const CustomWordCloud = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      <D3WordCloud
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "#fff" : "#000"}
        data={data}
      />
    </>
  );
};

export default CustomWordCloud;
