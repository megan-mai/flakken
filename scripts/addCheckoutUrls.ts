// studio/scripts/addCheckoutUrls.ts
// Adds a placeholder externalCheckoutUrl to the 6 example t-shirts from seedMerch.ts
// so the Purchase-on-hover button has something to render.
// Run with: npx sanity exec scripts/addCheckoutUrls.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const slugs = [
  'flagpole-tee-black',
  'flagpole-tee-white',
  'sap-magazine-logo-tee',
  'lowered-flags-tee',
  'flakken-script-tee',
  'archive-tee-vintage-wash',
]

async function run() {
  for (const slug of slugs) {
    const doc = await client.fetch(`*[_type == "merchItem" && slug.current == $slug][0]{_id, name}`, {
      slug,
    })
    if (!doc) {
      console.warn(`No merch item found for slug ${slug}, skipping`)
      continue
    }
    await client
      .patch(doc._id)
      .set({ externalCheckoutUrl: `https://example.com/checkout/${slug}` })
      .commit()
    console.log(`Set checkout URL for ${doc.name}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
