import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './UserContext'; // ⬅️ Import this
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider> {/* ⬅️ Wrap your entire app */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
