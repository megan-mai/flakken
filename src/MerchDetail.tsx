// web/src/MerchDetail.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { client } from './sanityClient'
import { urlFor } from './imageUrl'
import ShopifyBuyButton from './ShopifyBuyButton'

type MerchItem = {
  _id: string
  name: string
  price: number
  images: any[]
  gallery?: any[]
  description: any
  inStock: boolean
  externalCheckoutUrl?: string
  shopifyProductId?: string
}

function MerchDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState<MerchItem | null>(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "merchItem" && slug.current == $slug][0]{
          _id,
          name,
          price,
          images,
          gallery,
          description,
          inStock,
          externalCheckoutUrl,
          shopifyProductId
        }`,
        { slug }
      )
      .then(setItem)
  }, [slug])

  if (!item) return <main>Loading...</main>

  return (
    <main className="px-5 md:px-0 mb-24">
      {item.images?.[0] && (
        <div className="flex justify-center mt-12">
          <img src={urlFor(item.images[0]).width(800).url()} alt={item.name} className="w-full max-w-2xl" />
        </div>
      )}
      {item.gallery && item.gallery.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-4xl mx-auto">
          {item.gallery.map((image, i) => (
            <img
              key={i}
              src={urlFor(image).width(600).url()}
              alt={`${item.name} close-up ${i + 1}`}
              className="w-full max-w-xs"
            />
          ))}
        </div>
      )}
      <div
        className="fixed bottom-5 inset-x-0 mx-5 md:left-1/2 md:right-auto md:mx-0 md:-translate-x-1/2 md:w-full md:max-w-2xl text-black bg-white p-2 border border-zinc-400 text-sm hover:cursor-pointer"
        onClick={() => setDescriptionExpanded((expanded) => !expanded)}
      >
        <div className="relative pr-32">
          <div
            className="absolute right-0 mr-2 top-1/4 flex items-center gap-2 transition-all duration-300 ease-in-out"
          >
            {item.shopifyProductId ? (
              <div onClick={(e) => e.stopPropagation()}>
                <ShopifyBuyButton productId={item.shopifyProductId} />
              </div>
            ) : (
              item.externalCheckoutUrl && (
                <a
                  href={item.externalCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-black hover:cursor-pointer hover:bg-zinc-500 text-white px-3 py-1 text-xs"
                >
                  Buy
                </a>
              )
            )}
            <span className="text-zinc-500 text-xs mr-2 inline-block w-12 text-right -mt-1">
              {descriptionExpanded ? 'Info -' : 'Info +'}
            </span>
          </div>

          <p className="flex flex-col"><span className="font-bold">{item.name}</span>${item.price}</p>
          {!item.inStock && <p className="text-zinc-500">Sold out</p>}
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
              <PortableText value={item.description} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MerchDetail
