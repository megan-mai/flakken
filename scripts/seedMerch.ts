// studio/scripts/seedMerch.ts
// Creates 6 example t-shirt merchItem docs with a generated placeholder image each.
// Run with: npx sanity exec scripts/seedMerch.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const items = [
  { name: 'Flagpole Tee — Black', price: 35, color: '#1a1a1a' },
  { name: 'Flagpole Tee — White', price: 35, color: '#f4f3ec' },
  { name: 'SAP Magazine Logo Tee', price: 32, color: '#aa3bff' },
  { name: 'Lowered Flags Tee', price: 38, color: '#2f2f36' },
  { name: 'Flakken Script Tee', price: 30, color: '#ff2fb0' },
  { name: 'Archive Tee — Vintage Wash', price: 40, color: '#8a7f6b' },
]

function tshirtSvg(name: string, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
    <rect width="500" height="500" fill="#f4f3ec"/>
    <path d="M170 90 L230 60 L270 60 L330 90 L390 140 L350 190 L310 160 L310 440 L190 440 L190 160 L150 190 L110 140 Z"
      fill="${color}" stroke="#1a1a1a" stroke-width="4"/>
    <text x="250" y="470" font-family="system-ui, sans-serif" font-size="20" font-weight="600"
      fill="#1a1a1a" text-anchor="middle">${name}</text>
  </svg>`
}

async function run() {
  for (const item of items) {
    const svg = tshirtSvg(item.name, item.color)
    const asset = await client.assets.upload('image', Buffer.from(svg), {
      filename: `${slugify(item.name)}.svg`,
      contentType: 'image/svg+xml',
    })

    await client.create({
      _type: 'merchItem',
      name: item.name,
      slug: { _type: 'slug', current: slugify(item.name) },
      price: item.price,
      inStock: true,
      images: [
        {
          _type: 'image',
          _key: Math.random().toString(36).slice(2),
          asset: { _type: 'reference', _ref: asset._id },
        },
      ],
    })

    console.log(`Created ${item.name}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
