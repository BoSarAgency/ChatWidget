import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Function to initialize the chat widget
function initChatWidget() {
  // Create a container div for the widget
  const widgetContainer = document.createElement('div')
  widgetContainer.id = 'chat-widget-container'
  document.body.appendChild(widgetContainer)

  // Create React root and render the App
  const root = createRoot(widgetContainer)
  root.render(React.createElement(App))
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatWidget)
} else {
  initChatWidget()
}

// Export for manual initialization if needed
window.ChatWidget = {
  init: initChatWidget
}
