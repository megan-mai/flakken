// web/src/Title.tsx
import flakkenTitle from './assets/flakken_title.png'

function Title({
  textColor = 'text-red-500',
  subtitle,
  nowFlying,
}: {
  textColor?: string
  subtitle?: string | null
  nowFlying?: string | null
}) {
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 w-fit md:m-auto z-20 text-center ${textColor}`}
    >
      <img src={flakkenTitle} className="w-32 pt-6 md:w-100 md:mt-8 mx-auto"></img>
      {subtitle && <div className="text-xs mt-2 md:text-sm md:mt-4">{subtitle}</div>}
      {nowFlying && <div className="text-xs md:text-sm">{nowFlying}</div>}
    </div>
  )
}

export default Title
