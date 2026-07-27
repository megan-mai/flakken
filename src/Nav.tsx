// web/src/Nav.tsx
import { Link, NavLink } from 'react-router-dom'

const activeClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'text-blue-600' : '')

function Nav({ textColor = 'text-red-900', responsive = false }: { textColor?: string; responsive?: boolean }) {
  const positionClasses = responsive
    ? 'p-6 md:p-0 md:fixed md:top-8 md:left-8 md:z-20'
    : 'fixed top-6 left-6 md:top-8 md:left-8 z-20'

  return (
    <div
      className={`${positionClasses} flex flex-col items-start text-sm [&_a:hover]:text-blue-600 ${textColor}`}
    >
      <NavLink to="/" end className={activeClass}>Home</NavLink>
      <NavLink to="/archive" className={activeClass}>Lowered Flags</NavLink>
      <NavLink to="/merch" className={activeClass}>Shop</NavLink>
      <NavLink to="/info" className={activeClass}>Info</NavLink>
      <Link to='https://laylo.com/sapmagazine'>Mailing List</Link>
      <div className="w-50 mt-4 flex flex-col">
        <a href='mailto:contact@marketgallery.nyc'>contact@marketgallery.nyc</a>
        <a href="https://instagram.com/flakken.nyc" target="_blank" rel="noopener noreferrer">@flakken.nyc</a>
      </div>
    </div>
  )
}

export default Nav
