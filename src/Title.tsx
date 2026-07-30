// web/src/Title.tsx
import type { ReactNode } from 'react'
import flakkenTitle from './assets/flakken_title.png'

function Title({
  textColor = 'text-red-500',
  subtitle,
  nowFlying,
}: {
  textColor?: string
  subtitle?: ReactNode
  nowFlying?: string | null
}) {
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 w-max md:m-auto z-20 text-center ${textColor}`}
    >
      <img src={flakkenTitle} className="w-[80vw] min-w-44 max-w-[650px] pt-6 md:mt-6 mx-auto"></img>
      {subtitle && <div className="text-sm mt-2 md:mt-4">{subtitle}</div>}
      {nowFlying && <div className="text-sm">{nowFlying}</div>}
    </div>
  )
}

export default Title
