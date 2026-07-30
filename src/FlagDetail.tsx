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
  image2?: any
  description: any
  flownMonth: string
}

function FlagDetail() {
  const { slug } = useParams()
  const [flag, setFlag] = useState<Flag | null>(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "flag" && slug.current == $slug][0]{
          _id,
          title,
          image,
          image2,
          description,
          flownMonth
        }`,
        { slug }
      )
      .then(setFlag)
  }, [slug])

  if (!flag) return <main>Loading...</main>

  return (
    <main className="px-4 md:px-0 mb-24">
      {flag.image && (
        <div className="flex justify-center mt-6">
          <img
            src={urlFor(flag.image).width(800).url()}
            alt={flag.title}
            className="w-full max-w-2xl cursor-zoom-in"
            onClick={() => setZoomedImage(urlFor(flag.image).width(1600).url())}
          />
        </div>
      )}
      {flag.image2 && (
        <div className="flex justify-center mt-8">
          <img
            src={urlFor(flag.image2).width(800).url()}
            alt={flag.title}
            className="w-full max-w-2xl cursor-zoom-in"
            onClick={() => setZoomedImage(urlFor(flag.image2).width(1600).url())}
          />
        </div>
      )}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt={flag.title} className="max-w-full max-h-full object-contain" />
        </div>
      )}
      <div
        className="fixed bottom-4 inset-x-0 mx-4 md:left-1/2 md:right-auto md:mx-0 md:-translate-x-1/2 md:w-full md:max-w-2xl text-black bg-white p-2 border border-zinc-400 text-sm hover:cursor-pointer"
        onClick={() => setDescriptionExpanded((expanded) => !expanded)}
      >
        <div className="relative pr-32">
          <div
            className={`absolute right-0 mr-2 flex items-center transition-all duration-300 ease-in-out ${
              descriptionExpanded ? 'top-0 mt-2' : 'top-1/2 -translate-y-1/2'
            }`}
          >
            <a
              href={`mailto: Contact@sapmagazine.com?subject=${encodeURIComponent(`Inquiry - ${flag.title} Flag`)}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-black hover:cursor-pointer hover:bg-zinc-500 text-white px-3 py-1 text-xs"
            >
              Inquire
            </a>
            <span className="text-zinc-500 text-xs mr-2 inline-block w-12 text-right">
              {descriptionExpanded ? 'Info -' : 'Info +'}
            </span>
          </div>

          <div><span className="font-bold">{flag.title}</span>, ({flag.flownMonth})</div>
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

      </div>
    </main>
  )
}

export default FlagDetail
