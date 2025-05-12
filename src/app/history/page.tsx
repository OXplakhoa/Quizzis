import HistoryComponent from '@/components/HistoryComponent';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthSession } from '@/lib/nextauth'
import { LucideLayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const HistoryPage = async (props: Props) => {
    const session = await getAuthSession();
    if(!session?.user){
        return redirect('/')
    }
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]'>
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className='text-2xl font-bold'>Lịch sử làm bài</CardTitle>
                    <Link href='/' className={buttonVariants()}>
                        <LucideLayoutDashboard  />
                        Trở về trang chủ
                    </Link>
                </div>
            </CardHeader>
            <CardContent className='max-h-[60vh] overflow-y-auto'>
                <HistoryComponent limit={100} userId={session.user.id}/>
            </CardContent>
        </Card>
    </div>
  )
}

export default HistoryPage