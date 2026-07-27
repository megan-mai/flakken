// web/src/MerchDetail.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { client } from './sanityClient'
import { urlFor } from './imageUrl'

type MerchItem = {
  _id: string
  name: string
  price: number
  images: any[]
  description: any
  inStock: boolean
  externalCheckoutUrl?: string
}

function MerchDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState<MerchItem | null>(null)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "merchItem" && slug.current == $slug][0]{
          _id,
          name,
          price,
          images,
          description,
          inStock,
          externalCheckoutUrl
        }`,
        { slug }
      )
      .then(setItem)
  }, [slug])

  if (!item) return <main>Loading...</main>

  return (
    <main className="px-6 md:px-0 mt-12 pb-12">
      {item.images && item.images.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          {item.images.map((img, i) => (
            <img
              key={i}
              src={urlFor(img).width(800).url()}
              alt={item.name}
              className="w-full max-w-md object-cover"
            />
          ))}
        </div>
      )}
      <div className="max-w-2xl mx-auto mt-6 text-sm">
        <p className="font-bold">{item.name}</p>
        <p>${item.price}</p>
        {!item.inStock && <p className="text-zinc-500">Sold out</p>}
        <div className="mt-4">
          <PortableText value={item.description} />
        </div>
        {item.externalCheckoutUrl && (
          <a
            href={item.externalCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-black hover:bg-zinc-500 text-white px-3 py-1 text-xs"
          >
            Buy
          </a>
        )}
      </div>
    </main>
  )
}

export default MerchDetail
