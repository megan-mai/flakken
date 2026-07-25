// studio/scripts/seedFlagImages.ts
// Attaches a simple placeholder flag graphic (generated SVG) to each of the
// example flags created by seedFlags.ts.
// Run with: npx sanity exec scripts/seedFlagImages.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const flags = [
  { slug: 'neon-bloom', color: '#ff2fb0', stripe: '#ffb3e6' },
  { slug: 'static-horizon', color: '#2fd6ff', stripe: '#b3f0ff' },
  { slug: 'concrete-bloom', color: '#9c9c9c', stripe: '#d6d6d6' },
  { slug: 'afterimage', color: '#7a3bff', stripe: '#c9b3ff' },
  { slug: 'low-tide', color: '#1fae6b', stripe: '#a6e6c8' },
  { slug: 'paper-moon', color: '#f5c542', stripe: '#fce8a8' },
]

// 330x200 matches the ~330px-wide, ~1.65 aspect ratio of the real uploaded flag images
function flagSvg(title: string, color: string, stripe: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="330" height="200" viewBox="0 0 330 200">
    <rect width="330" height="200" fill="${color}"/>
    <rect y="0" width="330" height="30" fill="${stripe}"/>
    <rect y="170" width="330" height="30" fill="${stripe}"/>
    <rect x="20" y="0" width="8" height="200" fill="#1a1a1a"/>
    <text x="175" y="103" font-family="system-ui, sans-serif" font-size="18" font-weight="600"
      fill="#1a1a1a" text-anchor="middle" dominant-baseline="middle">${title}</text>
  </svg>`
}

async function run() {
  for (const flag of flags) {
    const doc = await client.fetch(`*[_type == "flag" && slug.current == $slug][0]{_id, title}`, {
      slug: flag.slug,
    })
    if (!doc) {
      console.warn(`No flag found for slug ${flag.slug}, skipping`)
      continue
    }

    const svg = flagSvg(doc.title, flag.color, flag.stripe)
    const asset = await client.assets.upload('image', Buffer.from(svg), {
      filename: `${flag.slug}.svg`,
      contentType: 'image/svg+xml',
    })

    await client
      .patch(doc._id)
      .set({
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        },
      })
      .commit()

    console.log(`Attached image to ${doc.title}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
