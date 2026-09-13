import { Component, type ErrorInfo, type ReactNode } from 'react'

interface IErrorFallbackProps {
  error: Error
  reset: () => void
}

interface IErrorBoundaryProps {
  children: ReactNode
  fallback: (props: IErrorFallbackProps) => ReactNode
}

interface IErrorBoundaryState {
  error: Error | null
}

// o React ainda só oferece error boundaries como componentes de classe
export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  state: IErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): IErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Erro inesperado na aplicação:', error, info.componentStack)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state

    if (error) return this.props.fallback({ error, reset: this.reset })

    return this.props.children
  }
}
