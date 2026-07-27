// web/src/Archive.tsx
import { useEffect, useState } from 'react'
import { client } from './sanityClient'
import { urlFor } from './imageUrl'
import { Link } from 'react-router-dom'


type ArchivedFlag = {
  _id: string
  title: string
  slug: { current: string }
  artistName: string
  image: any
  flownFrom: string
  flownTo: string
}

function Archive() {
  const [flags, setFlags] = useState<ArchivedFlag[]>([])

  useEffect(() => {
    client
      .fetch(
        `*[_type == "flag"] | order(_createdAt desc)[1...100]{
          _id,
          title,
          slug,
          artistName,
          image,
          flownFrom,
          flownTo
        }`
      )
      .then(setFlags)
  }, [])

  return (
    <main>
      <ul className='grid grid-cols-1 gap-x-4 gap-y-0 w-full px-6 lg:grid-cols-2 md:w-[55vw] md:px-0 mx-auto my-12'>
        {flags.map((flag) => (
          <li key={flag._id}>
            <Link to={`/archive/${flag.slug.current}`}>
              {flag.image && (
                <img
                  src={urlFor(flag.image).width(400).url()}
                  alt={flag.title}
                  className="w-full aspect-3/2 object-cover"
                />
              )}
              <p className="text-xs leading-tight mt-1">{flag.flownFrom} – {flag.flownTo}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Archive
