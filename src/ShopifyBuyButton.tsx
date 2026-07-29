// web/src/ShopifyBuyButton.tsx
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ShopifyBuy: any
  }
}

const SCRIPT_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.src = SCRIPT_URL
    script.onload = () => resolve()
    ;(document.head || document.body).appendChild(script)
  })
}

const PRODUCT_OPTIONS = {
  product: {
    styles: {
      product: {
        'max-width': '140px',
        'margin': '0',
      },
      button: {
        'font-family': 'Arial, sans-serif',
        ':hover': { 'background-color': '#3f3f3f' },
        'background-color': '#000000',
        ':focus': { 'background-color': '#3f3f3f' },
        'border-radius': '0px',
        'font-size': '14px',
        'padding-left': '12px',
        'padding-right': '12px',
        'padding-top': '4px',
        'padding-bottom': '4px',
      },
    },
    contents: { img: false, title: false, price: false },
    text: { button: 'Add to cart' },
  },
  productSet: {
    styles: {
      products: {
        '@media (min-width: 601px)': { 'margin-left': '-20px' },
      },
    },
  },
  modalProduct: {
    contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
    styles: {
      product: {
        '@media (min-width: 601px)': {
          'max-width': '100%',
          'margin-left': '0px',
          'margin-bottom': '0px',
        },
      },
      button: {
        'font-family': 'Arial, sans-serif',
        ':hover': { 'background-color': '#3f3f3f' },
        'background-color': '#000000',
        ':focus': { 'background-color': '#3f3f3f' },
        'border-radius': '0px',
        'padding-left': '78px',
        'padding-right': '78px',
      },
    },
    text: { button: 'Add to cart' },
  },
  option: {},
  cart: {
    styles: {
      button: {
        'font-family': 'Arial, sans-serif',
        ':hover': { 'background-color': '#3f3f3f' },
        'background-color': '#252525',
        ':focus': { 'background-color': '#3f3f3f' },
        'border-radius': '2px',
      },
    },
    text: { total: 'Subtotal', button: 'Checkout' },
  },
  toggle: {
    styles: {
      toggle: {
        'font-family': 'Arial, sans-serif',
        'background-color': '#252525',
        ':hover': { 'background-color': '#3f3f3f' },
        ':focus': { 'background-color': '#3f3f3f' },
      },
    },
  },
}

function ShopifyBuyButton({ productId }: { productId: string }) {
  const nodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    loadScript().then(() => {
      if (cancelled || !nodeRef.current) return
      const client = window.ShopifyBuy.buildClient({
        domain: '01ucq3-ey.myshopify.com',
        storefrontAccessToken: '78aeabe9d8333a02f730209c637f0e2c',
      })
      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        if (cancelled || !nodeRef.current) return
        ui.createComponent('product', {
          id: productId,
          node: nodeRef.current,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: PRODUCT_OPTIONS,
        })
      })
    })

    return () => {
      cancelled = true
    }
  }, [productId])

  return <div ref={nodeRef} className="w-[100px] h-[48px] overflow-hidden -mt-[20px]" />
}

export default ShopifyBuyButton
