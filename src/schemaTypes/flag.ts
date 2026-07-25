// schemaTypes/flag.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'flag',
  title: 'Flags',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Flag Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'image', title: 'Flag Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'gallery',
      title: 'Gallery / Close-ups',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'flownFrom', title: 'Flown From', type: 'string', description: 'e.g. "January 2025"' }),
    defineField({ name: 'flownTo', title: 'Flown To', type: 'string', description: 'e.g. "February 2025"' }),

    // artist info, inline
    defineField({ name: 'artistName', title: 'Artist Name', type: 'string' }),
    defineField({ name: 'artistBio', title: 'Artist Bio', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'artistPhoto', title: 'Artist Photo', type: 'image' }),
    defineField({ name: 'artistWebsite', title: 'Artist Website', type: 'url' }),
    defineField({ name: 'artistInstagram', title: 'Artist Instagram', type: 'url' }),
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
