import React from 'react'

import { createRoot } from 'react-dom/client'
import './index.css'
import 'antd/dist/reset.css'; 
import App from './App.jsx'
import { store, persistor } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './components/ThemeProvider.jsx';


createRoot(document.getElementById('root')).render(
  <PersistGate persistor = {persistor}>
    <Provider store={store}>
      <ThemeProvider>
      
          <App />
      
        </ThemeProvider>
    </Provider>
  </PersistGate>
);
