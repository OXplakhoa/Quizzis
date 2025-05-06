import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

type Props = {}

const RecentActivities = (props: Props) => {
  return (
    <Card className='col-span-4 lg:col-span-3 hover:cursor-pointer hover:opacity-80 transition-all duration-200 ease-in-out bg-gradient-to-r from-pink-500 to-pink-700 text-white shadow-lg shadow-pink-500/50'>
        <CardHeader>
            <CardTitle className='text-2xl font-bold text-white'>Hoạt động gần đây</CardTitle>
            <CardDescription className='text-white'>Bạn đã làm tổng cộng 8 bài.</CardDescription>
        </CardHeader>
        <CardContent className='max-h-[580px] overflow-y-auto'>
            Historiess
        </CardContent>
    </Card>
  )
}

export default RecentActivities