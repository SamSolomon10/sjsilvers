import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';

// Global Error Handler for "White Screen" debugging
window.onerror = function (message, source, lineno, colno, error) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; color: red; padding: 20px; z-index: 9999; font-family: monospace; overflow: auto;';
  errorDiv.innerHTML = `
    <h1>Application Crashed</h1>
    <h2>${message}</h2>
    <p>Source: ${source}:${lineno}:${colno}</p>
    <pre>${error?.stack || 'No stack trace'}</pre>
    <button onclick="window.location.reload()" style="padding: 10px 20px; font-size: 16px; margin-top: 20px; cursor: pointer;">Reload Application</button>
  `;
  document.body.appendChild(errorDiv);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
