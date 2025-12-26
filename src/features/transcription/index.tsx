import { TranscriptionTable } from './components/transcription-table'

export function Transcription() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          🎙️ Transcription Projects
        </h1>
        <p className='text-muted-foreground'>
          Manage your homelab transcription projects
        </p>
      </div>
      <TranscriptionTable />
    </div>
  )
}
