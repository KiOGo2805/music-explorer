import { z } from 'zod'

export const playlistFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Назва має містити щонайменше 2 символи')
    .max(50, 'Назва не може перевищувати 50 символів'),
  description: z
    .string()
    .trim()
    .max(200, 'Опис не може перевищувати 200 символів')
    .optional(),
  moodTag: z.enum(['Focus', 'Workout', 'Chill', 'Party']),
})

export const trackNoteSchema = z.object({
  note: z.string().trim().max(120, 'Нотатка не може перевищувати 120 символів'),
})