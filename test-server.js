import http from "http";
import url from "url";

const PORT = 3000;

// Simple in-memory storage for conversation threads
const conversations = {};

const server = http.createServer((req, res) => {
  // Enable CORS for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (path === "/messages" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { threadId, content } = JSON.parse(body);

        if (!threadId || !content) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing threadId or content" }));
          return;
        }

        // Initialize conversation if it doesn't exist
        if (!conversations[threadId]) {
          conversations[threadId] = [];
        }

        // Add user message to conversation
        conversations[threadId].push({ role: "user", content });

        // Generate responses with markdown content for testing
        const responses = [
          "Thanks for your message! How can I assist you further?",
          "I understand. Let me help you with that.\n\n**Here are some options:**\n- Option 1\n- Option 2\n- Option 3",
          "That's a great question! Here's what I think:\n\n```javascript\nconst answer = 'This is code!';\nconsole.log(answer);\n```",
          "I'm here to help! Could you provide more details?\n\n> *This is a quote to show markdown support*",
          "Interesting! Let me think about that for a moment.\n\n## Key Points:\n1. First point\n2. Second point\n3. Third point",
          "I appreciate you reaching out. What else would you like to know?\n\n**Bold text** and *italic text* work great!",
          "That makes sense. Is there anything specific you'd like me to explain?\n\n---\n\nHere's a horizontal rule above this text.",
          "I'm glad you asked! Here's my response:\n\n### Markdown Features:\n- **Bold text**\n- *Italic text*\n- `Inline code`\n- [Links](https://example.com)\n- Lists and more!",
        ];

        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        // Add assistant response to conversation
        conversations[threadId].push({
          role: "assistant",
          content: randomResponse,
        });

        // Simulate some processing time
        setTimeout(() => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ content: randomResponse }));
        }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/messages`);
  console.log("");
  console.log("To test the chat widget:");
  console.log("1. Open test.html in your browser");
  console.log("2. Click the chat button in the bottom-right corner");
  console.log("3. Send a message to test the functionality");
});
