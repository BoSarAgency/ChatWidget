# Chat Widget

A customizable floating chat widget built with React and Vite that can be easily embedded into any website.

## Features

- 🎨 **Fully Customizable**: Colors, title, logo, and messages
- 💬 **Real-time Chat**: Send and receive messages with loading indicators
- 📝 **Markdown Support**: Full markdown rendering in assistant messages
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔧 **Easy Integration**: Simple script tag integration
- 🎯 **Thread Management**: Automatic thread ID generation for conversation tracking
- ⚡ **Lightweight**: Optimized build with minimal footprint

## Quick Start

### 1. Build the Widget

```bash
npm install
npm run build
```

This creates the production files in the `dist/` directory:

- `chat-widget.css` - Widget styles
- `chat-widget.umd.cjs` - Widget JavaScript

### 2. Embed in Your Website

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Configure the widget -->
    <script>
      window.ChatWidgetConfig = {
        title: "Support Chat",
        logo: null, // Optional logo URL
        initialMessage: "Hi! How can I help you today?",
        color: "#007bff",
        userMessageBgColor: "#007bff",
        userMessageTextColor: "#ffffff",
        assistantMessageBgColor: "#f1f1f1",
        assistantMessageTextColor: "#333333",
        apiURL: "https://your-api.com/messages",
      };
    </script>

    <!-- Include widget styles -->
    <link rel="stylesheet" href="chat-widget.css" />
  </head>
  <body>
    <!-- Your page content -->

    <!-- Include widget script -->
    <script src="chat-widget.umd.cjs"></script>
  </body>
</html>
```

## Configuration Options

| Option                      | Type   | Default                            | Description                     |
| --------------------------- | ------ | ---------------------------------- | ------------------------------- |
| `title`                     | string | "Chat Assistant"                   | Header title                    |
| `logo`                      | string | null                               | Logo URL (optional)             |
| `initialMessage`            | string | "Hello! How can I help you today?" | First message shown             |
| `color`                     | string | "#007bff"                          | Primary color (header, buttons) |
| `userMessageBgColor`        | string | "#007bff"                          | User message background         |
| `userMessageTextColor`      | string | "#ffffff"                          | User message text color         |
| `assistantMessageBgColor`   | string | "#f1f1f1"                          | Assistant message background    |
| `assistantMessageTextColor` | string | "#333333"                          | Assistant message text color    |
| `apiURL`                    | string | "http://localhost:3000/messages"   | API endpoint URL                |

## API Requirements

Your backend API should handle POST requests to the configured endpoint with:

**Request:**

```json
{
  "threadId": "thread_abc123_1234567890",
  "content": "User message content"
}
```

**Response:**

```json
{
  "content": "Assistant response content with **markdown** support!"
}
```

## Markdown Support

The chat widget fully supports markdown in assistant messages. You can use:

- **Bold text** with `**text**` or `__text__`
- _Italic text_ with `*text*` or `_text_`
- `Inline code` with backticks
- Code blocks with triple backticks:
  ````
  ```javascript
  const code = 'example';
  ````
  ```

  ```
- Lists (ordered and unordered)
- > Blockquotes
- [Links](https://example.com)
- Headers (H1-H6)
- Horizontal rules with `---`

The markdown is automatically styled to match your chat widget's color scheme.

## Development

### Run Development Server

```bash
npm run dev
```

### Test the Widget

1. Start the test server: `node test-server.js`
2. Open `test.html` in your browser
3. Click the chat button to test functionality

### Build for Production

```bash
npm run build
```

## File Structure

```
├── src/
│   ├── App.jsx          # Main chat widget component
│   ├── App.css          # Widget styles
│   ├── widget.js        # Widget entry point for embedding
│   ├── main.jsx         # Development entry point
│   └── index.css        # Global styles
├── dist/                # Built files for production
├── test.html           # Test page
├── test-server.js      # Test API server
└── vite.config.js      # Build configuration
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

MIT
