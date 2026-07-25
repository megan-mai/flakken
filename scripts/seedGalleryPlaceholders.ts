// studio/scripts/seedGalleryPlaceholders.ts
// Run with: npx sanity exec scripts/seedGalleryPlaceholders.ts --with-user-token
import { randomUUID } from 'crypto'
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const COLORS = ['#aa3bff', '#ff5c5c', '#2f6fed', '#1fb977', '#f2a83b']
const CLOSEUPS_PER_FLAG = 3

function placeholderSvg(title: string, label: string, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <rect width="1200" height="1200" fill="${color}"/>
    <text x="600" y="560" font-family="system-ui, sans-serif" font-size="56" fill="white" text-anchor="middle">${title}</text>
    <text x="600" y="640" font-family="system-ui, sans-serif" font-size="36" fill="white" text-anchor="middle" opacity="0.8">${label}</text>
  </svg>`
}

async function run() {
  const flags: { _id: string; title: string; gallery?: unknown[] }[] = await client.fetch(
    `*[_type == "flag"]{ _id, title, gallery }`
  )

  for (const flag of flags) {
    if (flag.gallery && flag.gallery.length > 0) {
      console.log(`Skipping "${flag.title}" — already has a gallery.`)
      continue
    }

    const galleryItems = []
    for (let i = 0; i < CLOSEUPS_PER_FLAG; i++) {
      const color = COLORS[i % COLORS.length]
      const svg = placeholderSvg(flag.title, `Close-up ${i + 1}`, color)
      const asset = await client.assets.upload('image', Buffer.from(svg), {
        filename: `${flag._id}-closeup-${i + 1}.svg`,
        contentType: 'image/svg+xml',
      })
      galleryItems.push({
        _type: 'image',
        _key: randomUUID(),
        asset: { _type: 'reference', _ref: asset._id },
      })
    }

    await client.patch(flag._id).set({ gallery: galleryItems }).commit()
    console.log(`Added ${galleryItems.length} placeholder close-ups to "${flag.title}".`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
