// web/src/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  basePath: '/studio',
  title: 'flakken',
  projectId: 'emqbwrua',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Now Flying')
              .id('nowFlying')
              .child(S.document().schemaType('nowFlying').documentId('nowFlying')),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => item.getId() !== 'nowFlying'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
