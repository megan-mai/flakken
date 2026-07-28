// schemaTypes/merchItem.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'merchItem',
  title: 'Merch Items',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'price', title: 'Price', type: 'number' }),
    defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image' }] }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'relatedFlag', title: 'Related Flag', type: 'reference', to: [{ type: 'flag' }] }),
    defineField({ name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true }),
    defineField({ name: 'externalCheckoutUrl', title: 'Checkout URL', type: 'url' }),
    defineField({
      name: 'shopifyProductId',
      title: 'Shopify Product ID',
      type: 'string',
      description:
        'Shopify Admin → Product → Copy the sequence of numbers at the end of the URL, e.g. 9535683559644 and paste it in this field',
    }),
  ],
  preview: {
    select: { title: 'name', price: 'price', media: 'images.0' },
    prepare({ title, price, media }) {
      return {
        title,
        subtitle: price ? `$${price}` : '',
        media,
      }
    },
  },
})
