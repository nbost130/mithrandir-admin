import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type ServiceHealthInfo = {
  identifier: string
  name: string
  url: string
  port: number
  status: 'healthy' | 'unhealthy'
  uptime?: number
  version?: string
  error?: string
  details?: Record<string, unknown>
  lastChecked: string
}

type ServiceCardProps = {
  service: ServiceHealthInfo
  formatUptime: (seconds?: number) => string
}

export function ServiceCard({ service, formatUptime }: ServiceCardProps) {
  return (
    <Card className={service.status === 'unhealthy' ? 'border-red-200' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {service.name}
              {service.status === 'healthy' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>Port {service.port}</CardDescription>
          </div>
          <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>{service.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {service.uptime !== undefined && (
            <div>
              <span className="text-muted-foreground">Uptime:</span>
              <p className="font-medium">{formatUptime(service.uptime)}</p>
            </div>
          )}
          {service.version && (
            <div>
              <span className="text-muted-foreground">Version:</span>
              <p className="font-medium">{service.version}</p>
            </div>
          )}
        </div>

        {service.error && (
          <div className="rounded-md bg-red-50 p-2 text-xs text-red-800 dark:bg-red-950 dark:text-red-200">
            <span className="font-medium">Error:</span> {service.error}
          </div>
        )}

        {service.details && Object.keys(service.details).length > 0 && (
          <div className="text-xs">
            <span className="text-muted-foreground">Last checked:</span>
            <p className="font-medium">
              {formatDistanceToNow(new Date(service.lastChecked), {
                addSuffix: true,
              })}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(service.url, '_blank')}>
            <ExternalLink className="mr-2 h-3 w-3" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
