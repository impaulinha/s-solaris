import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ErrorPage } from '@/pages/ErrorPage'
import { NotFound } from '@/pages/NotFound'
import App from './App.tsx'
import './styles/fonts'
import './styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
})

// a aplicação tem uma única rota; qualquer outro caminho mostra a 404
// (em produção a Vercel já entrega o 404.html, aqui cobre o servidor de dev)
const isHomePage = ['/', '/index.html'].includes(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <ErrorBoundary
          fallback={({ error, reset }) => (
            <ErrorPage error={error} onRetry={reset} />
          )}
        >
          {isHomePage ? <App /> : <NotFound />}
        </ErrorBoundary>
      </MotionConfig>
    </QueryClientProvider>
  </StrictMode>
)
