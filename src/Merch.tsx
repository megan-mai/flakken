// web/src/Merch.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client } from './sanityClient'
import { urlFor } from './imageUrl'

type MerchItem = {
  _id: string
  name: string
  slug: { current: string }
  price: number
  images: any[]
  description: any
  inStock: boolean
  externalCheckoutUrl?: string
  shopifyProductId?: string
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
          externalCheckoutUrl,
          shopifyProductId
        }`
      )
      .then(setItems)
  }, [])

  return (
    <main>
      <ul className="grid sm:grid-cols-2 md:gap-x-16 md:gap-y-12 sm:gap-4 w-full px-4 md:grid-cols-3 md:w-[50vw] md:px-0 mx-auto mt-6 mb-10 text-black">
        {items.map((item) => (
          <li key={item._id} className="flex flex-col items-center">
            <Link to={item.slug?.current ? `/merch/${item.slug.current}` : '#'} className="block w-full">
              {item.images?.[0] && (
                <img
                  src={urlFor(item.images[0]).width(400).url()}
                  alt={item.name}
                  className="w-full aspect-4/5 object-cover"
                />
              )}
              <p className="text-xs pt-1">{item.name} – ${item.price}</p>
            </Link>
            {!item.slug?.current && <p className="text-sm">(no slug set)</p>}
            {!item.inStock && <p>Sold out</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Merch
