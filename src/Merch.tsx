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
      <ul className="grid grid-cols-2 gap-4 w-full px-5 md:grid-cols-2 md:w-[50vw] md:px-0 mx-auto my-12 ">
        {items.map((item) => (
          <li key={item._id} className="flex flex-col items-center">
            <Link to={item.slug?.current ? `/merch/${item.slug.current}` : '#'} className="block w-full">
              {item.images?.[0] && (
                <img
                  src={urlFor(item.images[0]).width(400).url()}
                  alt={item.name}
                  className="w-full aspect-square object-cover"
                />
              )}
              <p className="text-xs leading-tight mt-1">{item.name} – ${item.price}</p>
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
