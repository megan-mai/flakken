// studio/scripts/seedFlags.ts
// Run with: npx sanity exec scripts/seedFlags.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const flags = [
  {
    title: 'Neon Bloom',
    artistName: 'Jordan Vale',
    flownFrom: '2025-01-10',
    flownTo: '2025-01-24',
  },
  {
    title: 'Static Horizon',
    artistName: 'Reiko Tanaka',
    flownFrom: '2025-02-01',
    flownTo: '2025-02-15',
  },
  {
    title: 'Concrete Bloom',
    artistName: 'Marcus Webb',
    flownFrom: '2025-03-05',
    flownTo: '2025-03-19',
  },
  {
    title: 'Afterimage',
    artistName: 'Priya Chandra',
    flownFrom: '2025-04-12',
    flownTo: '2025-04-26',
  },
  {
    title: 'Low Tide',
    artistName: 'Sam Okafor',
    flownFrom: '2025-05-20',
    flownTo: '2025-06-03',
  },
  {
    title: 'Paper Moon',
    artistName: 'Ines Dupont',
    flownFrom: '2025-06-15',
    flownTo: '2025-06-29',
  },
]

async function run() {
  const tx = client.transaction()

  for (const flag of flags) {
    tx.create({
      _type: 'flag',
      title: flag.title,
      slug: { _type: 'slug', current: slugify(flag.title) },
      artistName: flag.artistName,
      flownFrom: flag.flownFrom,
      flownTo: flag.flownTo,
    })
  }

  const result = await tx.commit()
  console.log(`Created ${result.results.length} flags.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
