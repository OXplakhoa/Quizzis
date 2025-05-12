'use client'
import Image from 'next/image'
import React from 'react'
import { Progress } from './ui/progress'

type Props = {
  finished: boolean
}

const loadingQuotes: Array<string> = [
  "“Học không bao giờ là đủ, nhưng mỗi lần học là một bước tiến.”",
  "“Thành công không đến từ may mắn, mà từ sự chuẩn bị kỹ lưỡng.”",
  "“Mỗi câu hỏi là một cơ hội để bạn hiểu rõ bản thân hơn.”",
  "“Bạn không cần phải giỏi ngay từ đầu, chỉ cần không ngừng cố gắng.”",
  "“Thử thách là nơi tài năng được tỏa sáng.”",
  "“Người học hôm nay là người dẫn đầu ngày mai.”",
  "“Kiến thức là vũ khí mạnh nhất bạn có thể trang bị cho mình.”",
  "“Từng câu hỏi nhỏ tạo nên sự tự tin lớn.”",
  "“Đừng sợ thất bại, hãy sợ việc không cố gắng.”",
  "“Bạn đang tiến bộ, ngay cả khi bạn chưa nhận ra.”",
  "Đang tải câu hỏi..."
];

const LoadingQuestion = ({finished}: Props) => {
  const [progress, setProgress] = React.useState(0);
  const [loadingText, setLoadingText] = React.useState<string>(loadingQuotes[0]);
  React.useEffect(() => {
    const textInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingQuotes.length);
      setLoadingText(loadingQuotes[randomIndex]);
    }, 3000);
  
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (finished) {
          return 100;
        }
        if(prev === 100){
          return 0;
        }
        if (Math.random() < 0.1) {
          return prev + 2;
        }
        return prev + 0.5;
      });
    }, 100);
  
    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [finished]);

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center'>
      <Image src={'/loading.gif'} width={400} height={400} alt='loading animation'/>
      <Progress value={progress} className='w-full mt-4'/>
      <h1 className='mt-2 text-xl'>{loadingText}</h1>
    </div>
  )
}

export default LoadingQuestion