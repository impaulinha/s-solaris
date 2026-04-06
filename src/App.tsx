import { Layout } from '@/components/Layout'
import { Navbar } from '@/components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Layout
        roulette={<p>Menu</p>}
        info={<p>Infos</p>}
        scene={<p>Planeta</p>}
      />
    </>
  )
}

export default App
