// web/src/FlagDetail.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { client } from './sanityClient'
import { urlFor } from './imageUrl'

type Flag = {
  _id: string
  title: string
  image: any
  gallery?: any[]
  description: any
  flownFrom: string
  flownTo: string
  artistName: string
  artistBio: any
  artistPhoto: any
  artistWebsite?: string
  artistInstagram?: string
}

function FlagDetail() {
  const { slug } = useParams()
  const [flag, setFlag] = useState<Flag | null>(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "flag" && slug.current == $slug][0]{
          _id,
          title,
          image,
          gallery,
          description,
          flownFrom,
          flownTo,
          artistName,
          artistBio,
          artistPhoto,
          artistWebsite,
          artistInstagram
        }`,
        { slug }
      )
      .then(setFlag)
  }, [slug])

  if (!flag) return <main>Loading...</main>

  return (
    <main className="px-4 md:px-0">
          {flag.image && (
            <div className="flex justify-center mt-12">
              <img src={urlFor(flag.image).width(800).url()} alt={flag.title} className="w-full max-w-2xl" />
            </div>
      )}
      {flag.gallery && flag.gallery.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-4xl mx-auto">
          {flag.gallery.map((image, i) => (
            <img
              key={i}
              src={urlFor(image).width(600).url()}
              alt={`${flag.title} close-up ${i + 1}`}
              className="w-full max-w-xs"
            />
          ))}
        </div>
      )}
      <div
        className="fixed bottom-12 inset-x-0 mx-4 md:left-1/2 md:right-auto md:mx-0 md:-translate-x-1/2 md:w-full md:max-w-2xl text-black bg-white p-2 border border-zinc-400 text-sm hover:cursor-pointer"
        onClick={() => setDescriptionExpanded((expanded) => !expanded)}
      >
        <div className="relative">
          <div
            className={`absolute right-0 mr-2 flex items-center transition-all duration-300 ease-in-out ${
              descriptionExpanded ? 'top-0 mt-2 ' : 'top-1/2 -translate-y-1/2'
            }`}
          >
            <a
              href={`mailto:contact@marketgallery.nyc?subject=${encodeURIComponent(`Inquiry - ${flag.artistName} Flag`)}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-black hover:cursor-pointer hover:bg-zinc-500 text-white px-3 py-1 text-xs"
            >
              Inquire
            </a>
            <span className="text-zinc-500 text-xs mr-2 inline-block w-12 text-right">
              {descriptionExpanded ? 'Info -' : 'Info +'}
            </span>
          </div>

          <p><span className="font-bold">{flag.artistName}</span> (b.1999)</p>
          <div><span className="font-bold">{flag.title}</span>, ({flag.flownFrom} – {flag.flownTo})</div>
        </div>
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              descriptionExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div
                className={`py-2 transition-opacity duration-300 ease-in-out ${
                  descriptionExpanded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <PortableText value={flag.description} />
              </div>
            </div>
          </div>
          {flag.artistPhoto && <img src={urlFor(flag.artistPhoto).width(200).url()} alt={flag.artistName} />}
          {flag.artistWebsite && <a href={flag.artistWebsite} target="_blank" rel="noopener noreferrer">Website</a>}
        {flag.artistInstagram && <a href={flag.artistInstagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
      </div>
        </main>
  )
}

export default FlagDetail
