// web/src/sanity/client.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'emqbwrua',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
})
