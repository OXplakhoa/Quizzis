import HistoryComponent from '@/components/HistoryComponent'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const RecentActivities = async(props: Props) => {
  const session = await getAuthSession();
  if(!session?.user){
    return redirect('/')
  }
  const gamesCount = await prisma.game.count({
    where: {
      userId: session.user.id
    }
  })
  return (
    <Card className='col-span-4 lg:col-span-3 hover:cursor-pointer hover:opacity-90 transition-all duration-300 ease-in-out bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl shadow-purple-500/30 rounded-xl border-0'>
        <CardHeader className='space-y-2 pb-4'>
            <CardTitle className='text-3xl font-bold text-white tracking-tight'>Hoạt động gần đây</CardTitle>
            <CardDescription className='text-white/90 text-lg font-medium'>
                Bạn đã làm tổng cộng <span className='font-bold text-white'>{gamesCount}</span> bài.
            </CardDescription>
        </CardHeader>
        <CardContent className='max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'>
            <HistoryComponent limit={5} userId={session?.user.id}/>
        </CardContent>
    </Card>
  )
}

export default RecentActivities