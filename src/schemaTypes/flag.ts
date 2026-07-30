// schemaTypes/flag.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'flag',
  title: 'Flags',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Flag Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'image', title: 'Primary Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'image2', title: 'Secondary Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'flownMonth', title: 'Flown Month', type: 'string', description: 'e.g. "January 2025"' }),

  ],
  preview: {
    select: { title: 'title', artist: 'artistName', media: 'image' },
    prepare({ title, artist, media }) {
      return {
        title,
        subtitle: artist ? `by ${artist}` : '',
        media,
      }
    },
  },
})
