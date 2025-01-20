import { file } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const calendar = defineCollection({
    loader: file("src/data/calendar.yaml"),
    schema: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        date: z.date(),
        time: z.string().time().optional(),
        duration: z.string().time(),
        location: z.string(),
        url: z.string().optional(),
        type: z.object({
            festival: z.boolean().optional(),
            party: z.boolean().optional(),
            regular_course: z.boolean().optional(),
            workshop: z.boolean().optional(),
            requires_registration: z.boolean().optional(),
        }),
        children: z.array(z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            date: z.date(),
            time: z.string().time().optional(),
            duration: z.string().time(),
            location: z.string(),
            url: z.string().optional(),
            type: z.object({
                festival: z.boolean().optional(),
                party: z.boolean().optional(),
                regular_course: z.boolean().optional(),
                workshop: z.boolean().optional(),
                requires_registration: z.boolean().optional(),
            }),
        })).optional()
    })
});

export const collections = { calendar }
