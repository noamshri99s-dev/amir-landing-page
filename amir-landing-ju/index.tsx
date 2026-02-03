
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 Starting app initialization...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error("Could not find root element to mount to");
}

console.log('✅ Root element found:', rootElement);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ App rendered successfully');
