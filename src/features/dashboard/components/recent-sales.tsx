import { formatDistanceToNow } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { dashboardApi } from '../api/dashboard-api'

export function RecentSales() {
  const { data: activity = [], isLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => dashboardApi.getActivity(5),
    refetchInterval: 15000, // Refresh every 15 seconds
  })

  if (isLoading) {
    return (
      <div className='space-y-8'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='flex animate-pulse items-center gap-4'>
            <div className='bg-muted h-9 w-9 rounded-full' />
            <div className='flex-1 space-y-2'>
              <div className='bg-muted h-4 w-32 rounded' />
              <div className='bg-muted h-3 w-24 rounded' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!activity.length) {
    return (
      <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
        No recent activity
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {activity.map((item) => {
        const statusIcon =
          item.metadata.status === 'completed' ? (
            <CheckCircle2 className='h-4 w-4 text-green-500' />
          ) : item.metadata.status === 'failed' ? (
            <XCircle className='h-4 w-4 text-red-500' />
          ) : (
            <Clock className='h-4 w-4 text-yellow-500' />
          )

        const initials = item.details
          .split(' ')
          .slice(0, 2)
          .map((word) => word[0])
          .join('')
          .toUpperCase()

        return (
          <div key={item.id} className='flex items-center gap-4'>
            <Avatar className='h-9 w-9'>
              <AvatarFallback className='bg-primary/10 text-xs'>
                {initials.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-wrap items-center justify-between gap-2'>
              <div className='min-w-0 flex-1 space-y-1'>
                <p className='truncate text-sm leading-none font-medium'>
                  {item.details}
                </p>
                <p className='text-muted-foreground flex items-center gap-1 text-xs'>
                  {statusIcon}
                  <span>
                    {formatDistanceToNow(new Date(item.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                </p>
              </div>
              {item.metadata.duration && (
                <div className='text-muted-foreground text-xs font-medium'>
                  {(item.metadata.duration / 1024 / 1024).toFixed(1)} MB
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
