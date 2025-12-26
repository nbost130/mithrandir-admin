import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { dashboardApi } from '../api/dashboard-api'

export function Overview() {
  const { data: trends = [], isLoading } = useQuery({
    queryKey: ['dashboard-trends'],
    queryFn: () => dashboardApi.getTrends(7),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const chartData = trends.map((trend) => ({
    name: new Date(trend.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    total: trend.total,
    completed: trend.completed,
    failed: trend.failed,
  }))

  if (isLoading || !chartData.length) {
    return (
      <div className='text-muted-foreground flex h-[350px] items-center justify-center'>
        {isLoading ? 'Loading trends...' : 'No data available'}
      </div>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
