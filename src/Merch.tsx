// web/src/Merch.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client } from './sanityClient'
import { urlFor } from './imageUrl'
import ShopifyBuyButton from './ShopifyBuyButton'

type MerchItem = {
  _id: string
  name: string
  slug: { current: string }
  price: number
  images: any[]
  description: any
  inStock: boolean
  externalCheckoutUrl?: string
}

function Merch() {
  const [items, setItems] = useState<MerchItem[]>([])

  useEffect(() => {
    client
      .fetch(
        `*[_type == "merchItem"] | order(_createdAt desc){
          _id,
          name,
          slug,
          price,
          images,
          description,
          inStock,
          externalCheckoutUrl
        }`
      )
      .then(setItems)
  }, [])

  return (
    <main>
      <ul className="grid grid-cols-2 gap-4 w-full px-6 md:grid-cols-3 md:w-[50vw] md:px-0 mx-auto my-12 ">
        {items.map((item, i) => (
          <li key={item._id} className="flex flex-col items-center">
            <div className="group relative w-full aspect-square">
              <div className="hidden md:flex absolute h-fit p-2 top-0 inset-x-0 items-center justify-center gap-2 text-sm text-white">
                <h2>{item.name}</h2>
                <p>${item.price}</p>
              </div>
              {i === 0 ? (
                <div className="hidden md:flex absolute h-fit bottom-0 inset-x-0 items-center justify-center">
                  <ShopifyBuyButton />
                </div>
              ) : (
                item.externalCheckoutUrl && (
                  <a
                    href={item.externalCheckoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex absolute bg-black h-fit p-2 bottom-0 inset-x-0 items-center justify-center border border-current text-sm"
                  >
                    Purchase
                  </a>
                )
              )}
              {item.images?.[0] && (
                <Link
                  to={item.slug?.current ? `/merch/${item.slug.current}` : '#'}
                  className="absolute inset-0 block transition-opacity duration-200 md:group-hover:opacity-0 md:group-hover:pointer-events-none"
                >
                  <img
                    src={urlFor(item.images[0]).width(400).url()}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
              )}
            </div>
            {!item.slug?.current && <p className="text-sm">(no slug set)</p>}
            {!item.inStock && <p>Sold out</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Merch
