import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/themes.css';
import './styles/animations.css';
import './styles/transitions.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);