import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import "./index.css"
import { ThemeProvider } from './providers/theme.tsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <ToastContainer 
        position='bottom-right'
        autoClose={2500}
        closeOnClick={true}
        pauseOnFocusLoss={false}
      />
    </ThemeProvider>
  </StrictMode>,
)
