"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Hourglass } from "lucide-react";
import { differenceInSeconds } from "date-fns";
import { formatMMSS } from "@/lib/utils";

type Props = {
  gameId: string;
  now: Date;
  timeStarted: Date;
  onFinalTimeUpdate?: (time: string) => void;
};

const TimetakenCard = ({ gameId, now, timeStarted, onFinalTimeUpdate }: Props) => {
  const [finalTime, setFinalTime] = useState<string>("");

  useEffect(() => {
    const time = formatMMSS(differenceInSeconds(now, timeStarted));
    setFinalTime(time);
    onFinalTimeUpdate?.(time);
  }, [now, timeStarted, onFinalTimeUpdate]);

  return (
    <Card className='md:col-span-4'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-2xl font-bold'>Thời gian</CardTitle>
        <Hourglass />
      </CardHeader>
      <CardContent>
        <div className='text-sm font-medium'>
          {finalTime}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimetakenCard;