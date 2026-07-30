// web/src/Archive.tsx
import { useEffect, useState } from 'react'
import { client } from './sanityClient'
import { urlFor } from './imageUrl'
import { Link } from 'react-router-dom'


type ArchivedFlag = {
  _id: string
  title: string
  slug: { current: string } | null
  artistName: string
  image: any
  flownMonth: string
}

function Archive() {
  const [flags, setFlags] = useState<ArchivedFlag[]>([])

  useEffect(() => {
    client
      .fetch(
        `*[_type == "flag"] | order(_createdAt desc)[0...100]{
          _id,
          title,
          slug,
          artistName,
          image,
          flownMonth
        }`
      )
      .then(setFlags)
  }, [])

  return (
    <main>
      <ul className='grid grid-cols-1 gap-x-3 gap-y-3 w-full px-4 lg:grid-cols-3 md:w-[55vw] md:px-0 mx-auto mt-6 mb-10'>
        {flags.map((flag) => (
          <li key={flag._id}>
            <Link to={flag.slug?.current ? `/archive/${flag.slug.current}` : '#'}>
              {flag.image && (
                <img
                  src={urlFor(flag.image).width(400).url()}
                  alt={flag.title}
                  className="w-full aspect-3/2 object-cover"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Archive
