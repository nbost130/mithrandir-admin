import { createFileRoute } from '@tanstack/react-router';
import { Transcription } from '@/features/transcription';

export const Route = createFileRoute('/_authenticated/transcription/')({
  component: Transcription,
});
