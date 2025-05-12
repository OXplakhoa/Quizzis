import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Hourglass } from 'lucide-react'
import { differenceInSeconds } from 'date-fns'
import { formatMMSS } from '@/lib/utils'

type Props = {
    timeStarted: Date
    timeEnded: Date
}

const TimetakenCard = ({timeStarted, timeEnded}: Props) => {
  return (
    <Card className='md:col-span-4'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-2xl font-bold'>Thời gian</CardTitle>
            <Hourglass/>
        </CardHeader>
        <CardContent>
            <div className='text-sm font-medium'>
                {formatMMSS(differenceInSeconds(timeEnded, timeStarted))}
            </div>
        </CardContent>
    </Card>
  )
}

export default TimetakenCard