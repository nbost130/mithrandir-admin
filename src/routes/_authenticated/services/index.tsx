import { formatDistanceToNow } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2,
  XCircle,
  Activity,
  Server,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { servicesApi } from '@/features/services/api/services-api'

function ServicesPage() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['services-health'],
    queryFn: () => servicesApi.getHealth(),
    refetchInterval: 15000,
  })

  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Services Health
            </h1>
            <p className='text-muted-foreground'>
              Monitor status and health of all Mithrandir services
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            disabled={isRefetching}
            variant='outline'
            size='sm'
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>

        {!isLoading && data && (
          <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Services
                </CardTitle>
                <Server className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data.summary.total}</div>
                <p className='text-muted-foreground text-xs'>
                  Monitored services
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Healthy</CardTitle>
                <CheckCircle2 className='h-4 w-4 text-green-500' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>
                  {data.summary.healthy}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Running normally
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Unhealthy</CardTitle>
                <XCircle className='h-4 w-4 text-red-500' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-red-600'>
                  {data.summary.unhealthy}
                </div>
                <p className='text-muted-foreground text-xs'>Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  System Health
                </CardTitle>
                <Activity className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {data.summary.healthPercentage}%
                </div>
                <p className='text-muted-foreground text-xs'>Overall status</p>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className='animate-pulse'>
                <CardHeader>
                  <div className='bg-muted h-5 w-32 rounded' />
                  <div className='bg-muted h-4 w-24 rounded' />
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='bg-muted h-4 w-full rounded' />
                    <div className='bg-muted h-4 w-3/4 rounded' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !data ? (
          <Card>
            <CardContent className='flex items-center justify-center py-10'>
              <div className='text-center'>
                <AlertCircle className='text-muted-foreground mx-auto h-12 w-12' />
                <p className='text-muted-foreground mt-2'>
                  Failed to load services data
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {data.services.map((service) => (
              <Card
                key={service.identifier}
                className={
                  service.status === 'unhealthy' ? 'border-red-200' : ''
                }
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='flex items-center gap-2'>
                        {service.name}
                        {service.status === 'healthy' ? (
                          <CheckCircle2 className='h-4 w-4 text-green-500' />
                        ) : (
                          <XCircle className='h-4 w-4 text-red-500' />
                        )}
                      </CardTitle>
                      <CardDescription>Port {service.port}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        service.status === 'healthy' ? 'default' : 'destructive'
                      }
                    >
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    {service.uptime !== undefined && (
                      <div>
                        <span className='text-muted-foreground'>Uptime:</span>
                        <p className='font-medium'>
                          {formatUptime(service.uptime)}
                        </p>
                      </div>
                    )}
                    {service.version && (
                      <div>
                        <span className='text-muted-foreground'>Version:</span>
                        <p className='font-medium'>{service.version}</p>
                      </div>
                    )}
                  </div>

                  {service.error && (
                    <div className='rounded-md bg-red-50 p-2 text-xs text-red-800 dark:bg-red-950 dark:text-red-200'>
                      <span className='font-medium'>Error:</span>{' '}
                      {service.error}
                    </div>
                  )}

                  {service.details &&
                    Object.keys(service.details).length > 0 && (
                      <div className='text-xs'>
                        <span className='text-muted-foreground'>
                          Last checked:
                        </span>
                        <p className='font-medium'>
                          {formatDistanceToNow(new Date(service.lastChecked), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    )}

                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      className='flex-1'
                      onClick={() => window.open(service.url, '_blank')}
                    >
                      <ExternalLink className='mr-2 h-3 w-3' />
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Services',
    href: '/services',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Logs',
    href: '/services/logs',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Metrics',
    href: '/services/metrics',
    isActive: false,
    disabled: true,
  },
]

export const Route = createFileRoute('/_authenticated/services/')({
  component: ServicesPage,
})
