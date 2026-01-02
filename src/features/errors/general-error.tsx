import { useEffect } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const { history, state } = router
  const routerState = state as typeof state & { latestError?: unknown }
  const latestError =
    routerState.latestError ||
    routerState.matches.find((match) => match.error)?.error
  const errorMessage = latestError
    ? latestError instanceof Error
      ? latestError.message
      : typeof latestError === 'string'
        ? latestError
        : JSON.stringify(latestError)
    : null

  useEffect(() => {
    if (latestError) {
      // eslint-disable-next-line no-console -- surface router failures for production debugging
      console.error('[GeneralError] Router reported error', latestError)
      if (typeof window !== 'undefined') {
        ;(
          window as typeof window & { __GENERAL_ERROR__?: unknown }
        ).__GENERAL_ERROR__ = {
          error: latestError,
          message: errorMessage,
        }
      }
    }
  }, [latestError, errorMessage])
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        )}
        <span className='font-medium'>Oops! Something went wrong {`:')`}</span>
        {errorMessage && (
          <p className='text-muted-foreground text-xs'>{errorMessage}</p>
        )}
        <p className='text-muted-foreground text-center'>
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => history.go(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
          </div>
        )}
      </div>
    </div>
  )
}
