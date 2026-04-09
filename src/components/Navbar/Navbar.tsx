import LOGO from '@/assets/logo-ssolaris.png'

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-3 py-4">
      <div className="flex items-center justify-center opacity-70">
        <img src={LOGO} alt="Logotipo S-Solaris" className="h-10 lg:hidden" />
      </div>

      <nav>
        <li className="list-none mr-6 text-lg">
          <span className="text-nebula-900">_</span>
          <span className="text-star-400">S-Solaris</span>
        </li>
      </nav>
    </header>
  )
}
