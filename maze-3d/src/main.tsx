import * as React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DailogContextProvider from './components/portalcustom/custom-portal-context'
import { Toaster } from 'sonner'
const queryClient = new QueryClient()
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      
      <QueryClientProvider client={queryClient}>
      <DailogContextProvider>
      <RouterProvider router={router} />
      <Toaster richColors /> 
      </DailogContextProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  )
}