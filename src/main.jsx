import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { HMSRoomProvider } from "@100mslive/react-sdk"

createRoot(document.getElementById('root')).render(
  <HMSRoomProvider>
    <Provider store={store}>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </Provider>
  </HMSRoomProvider>,
)
