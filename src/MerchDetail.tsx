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
    <main>
      {item.images?.map((img, i) => (
        <img key={i} src={urlFor(img).width(800).url()} alt={item.name} />
      ))}
      <h1>{item.name}</h1>
      <p>${item.price}</p>
      {!item.inStock && <p>Sold out</p>}
      <PortableText value={item.description} />
      {item.externalCheckoutUrl && (
        <a href={item.externalCheckoutUrl} target="_blank" rel="noopener noreferrer">
          Buy
        </a>
      )}
    </main>
  )
}

export default MerchDetail
