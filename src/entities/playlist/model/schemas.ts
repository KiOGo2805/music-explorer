import { z } from 'zod'

export const playlistFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  moodTag: z.enum(['Focus', 'Workout', 'Chill', 'Party']),
})

export const trackNoteSchema = z.object({
  note: z.string().max(120),
})
