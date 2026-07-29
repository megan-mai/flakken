// web/src/Nav.tsx
import { Link, NavLink } from 'react-router-dom'

const activeClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'text-blue-600' : '')
const homeActiveClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'text-red-500' : '')

function Nav({ textColor = 'text-red-900', responsive = false }: { textColor?: string; responsive?: boolean }) {
  const positionClasses = responsive
    ? 'p-5 md:p-0 md:fixed md:top-6 md:left-8 md:z-20'
    : 'fixed top-5 left-5 md:top-6 md:left-8 z-20'

  return (
    <div
      className={`${positionClasses} flex flex-col items-start text-sm [&_a:hover]:text-red-500 ${textColor}`}
    >
      <NavLink to="/" end className={homeActiveClass}>Home</NavLink>
      <NavLink to="/archive" className={activeClass}>Lowered Flags</NavLink>
      <NavLink to="/merch" className={activeClass}>Shop</NavLink>
      <NavLink to="/info" className={activeClass}>Info</NavLink>
      <Link to='https://laylo.com/sapmagazine' target="_blank">Mailing List</Link>
      <div className="w-52 mt-4 text-pretty">
        To book an appointment reach out to
        <a href='mailto:contact@marketgallery.nyc'> contact@marketgallery.nyc </a>
        or DM us <a href="https://instagram.com/flakken.nyc" target="_blank" rel="noopener noreferrer">@flakken.nyc</a>
      </div>
    </div>
  )
}

export default Nav
