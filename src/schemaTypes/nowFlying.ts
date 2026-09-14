// schemaTypes/nowFlying.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'nowFlying',
  title: 'Now Flying',
  type: 'document',
  fields: [
    defineField({
      name: 'nowFlying',
      title: 'Now Flying Text',
      type: 'string',
      description: 'Shown on the homepage under the title, e.g. "Now flying: Some Flag Name"',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Now Flying' }
    },
  },
})
