import { ErrorBoundary as SolidErrorBoundary, type JSX } from 'solid-js'
import { Button } from '@nl/ui/base/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nl/ui/base/card'
import { AlertCircle } from 'lucide-solid'

interface ErrorBoundaryProps {
  children: JSX.Element
}

const fallback = (error: Error) => (
  <div class="w-full h-full min-h-[75vh] flex items-center justify-center p-4 bg-background rounded-lg">
    <Card class="w-full max-w-lg text-center">
      <CardHeader>
        <CardTitle class="flex justify-center items-center gap-2 text-4xl font-bold text-error">
          <AlertCircle class="h-10 w-10 text-error" /> Oops!
        </CardTitle>
        <CardDescription class="text-center text-lg">
          Something went wrong. An unexpected error occurred.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <details class="text-left text-sm bg-muted text-muted-foreground p-4 rounded-lg">
            <summary class="cursor-pointer font-medium">Error Details</summary>
            <pre class="whitespace-pre-wrap break-words mt-2">{error.toString()}</pre>
          </details>
        )}
        <Button onClick={() => window.location.reload()} class="mt-6">
          Reload Page
        </Button>
      </CardContent>
    </Card>
  </div>
)

/**
 * Solid's `ErrorBoundary` catches errors thrown by descendants and renders the
 * fallback in their place — the same contract the React class version exposed.
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <SolidErrorBoundary
      fallback={(error: Error) => {
        console.error('ErrorBoundary caught an error:', error)
        return fallback(error)
      }}
    >
      {props.children}
    </SolidErrorBoundary>
  )
}

export default ErrorBoundary
