// web/src/App.tsx
import { Studio } from 'sanity'
import studioConfig from './sanity.config'
import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { client } from './sanityClient'
import marketLogo from './assets/market_logo.png'
import Nav from './Nav'
import Title from './Title'
import Home from './Home'
import Archive from './Archive'
import Merch from './Merch'
import Info from './Info'
import FlagDetail from './FlagDetail'
import MerchDetail from './MerchDetail'

function App() {
  const { pathname } = useLocation()
  const [flag, setFlag] = useState<{ artistName?: string } | null>(null)

  useEffect(() => {
    client
      .fetch(`*[_type == "flag"] | order(_createdAt desc)[0]{ artistName }`)
      .then(setFlag)
  }, [])

  const isStudio = pathname.startsWith('/studio')
  const isStaticHeader =
    pathname === '/merch' ||
    pathname.startsWith('/merch/') ||
    pathname === '/archive' ||
    pathname.startsWith('/archive/') ||
    pathname === '/info'
  const textColor = pathname === '/' ? 'text-white' : 'text-red-500'
  const subtitle =
    pathname === '/' ? (
      <>
        Curated and Presented by{' '}
        <a
          href="https://sapmagazine.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-red-500"
        >
          SAP Magazine
        </a>
      </>
    ) : undefined
  const nowFlying = pathname === '/' ? `Now flying: ${flag?.artistName ?? ''}` : undefined

  if (isStudio) {
    return (
      <Routes>
        <Route path="/studio/*" element={<Studio config={studioConfig} />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Home visible={pathname === '/'} />
      <div className={isStaticHeader ? 'relative' : ''}>
        <Nav textColor={textColor} responsive={isStaticHeader} />
        <a href="https://www.marketgallery.nyc/" target="_blank">
        <img
          src={marketLogo}
          alt="Market Gallery"
          className={
            isStaticHeader
              ? 'absolute md:fixed top-5 right-5 md:top-8 md:right-8 z-20 h-12 w-auto'
              : 'fixed top-5 right-5 md:top-8 md:right-8 z-20 h-12 w-auto'
          }
          />
        </a>
      </div>
      <div className={isStaticHeader ? 'hidden md:block' : ''}>
        <Title textColor={textColor} subtitle={subtitle} nowFlying={nowFlying} />
      </div>
      <div className="flex-1 min-h-0">
        <Routes>
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/:slug" element={<FlagDetail />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/merch/:slug" element={<MerchDetail />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
      <p className="md:hidden px-5 text-sm text-red-500 pb-4">
        Curated and Presented by{' '}
        <a
          href="https://sapmagazine.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-red-500"
        >
          SAP Magazine
        </a>
      </p>
    </div>
  )
}

export default App
