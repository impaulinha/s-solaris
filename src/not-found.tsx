import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { NotFound } from '@/pages/NotFound'
import './styles/fonts'
import './styles/index.css'

// entrada do 404.html: não carrega a cena 3D, só a página de erro
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <NotFound />
    </MotionConfig>
  </StrictMode>
)
