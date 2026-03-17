const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// In-memory stats and logging
let requestCount = 0;
const startTime = Date.now();
const systemEvents = [];

function logEvent(message, type = 'info') {
  const event = {
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    message,
    type
  };
  systemEvents.unshift(event);
  if (systemEvents.length > 50) systemEvents.pop();
  console.log(`[SYSTEM ${type.toUpperCase()}] ${message}`);
}

// Initial log
logEvent('System initialized and ready.', 'success');

// Data Persistence setup
const DATA_DIR = path.join(__dirname, 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedbacks.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Initialize file if not exists
if (!fs.existsSync(FEEDBACK_FILE)) {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2));
}

function getFeedbacks() {
  try {
    const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading feedbacks:', err);
    return [];
  }
}

function saveFeedback(feedback) {
  const feedbacks = getFeedbacks();
  feedbacks.push({
    ...feedback,
    id: Date.now(),
    status: 'pending'
  });
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
  return feedbacks;
}

// Global counter for demo
let counter = 0;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Request tracking middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/' || req.path === '/submit-feedback') {
    requestCount++;
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'feedback.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Application is healthy' });
});

// Stats API
app.get('/api/stats', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const uptimeString = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`;

  res.json({
    uptime: uptimeString,
    requests: requestCount,
    users: 1 + Math.floor(Math.random() * 5),
    status: 'Healthy',
    events: systemEvents
  });
});

// Admin API
app.get('/api/feedbacks', (req, res) => {
  const auth = req.headers.authorization;
  if (auth === ADMIN_PASSWORD) {
    res.json(getFeedbacks());
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/api/feedbacks/delete/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = parseInt(req.params.id);
  const feedbacks = getFeedbacks().filter(f => f.id !== id);
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
  logEvent(`Feedback #${id} deleted by administrator`, 'warning');
  res.json({ success: true });
});

// Admin crash endpoint (Protected)
app.post('/api/admin/crash', (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  logEvent('CRASH SIGNAL RECEIVED FROM ADMIN DASHBOARD', 'error');
  res.json({ success: true, message: 'System will crash in 1 second...' });

  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Simulate a crash for demonstration
app.get('/crash', (req, res) => {
  res.send('Crashing the application in 3 seconds...');
  setTimeout(() => {
    process.exit(1);
  }, 3000);
});

// Handle form submissions
app.post('/submit-feedback', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const feedback = {
    name,
    email,
    message,
    timestamp: new Date().toLocaleString()
  };

  saveFeedback(feedback);
  logEvent(`New feedback received from ${name}`, 'info');
  console.log('Feedback received and saved:', feedback);

  if (req.headers['content-type'] === 'application/json' || req.xhr) {
    return res.json({ success: true });
  }

  res.redirect('/feedback');
});

// Counter endpoints
app.get('/counter', (req, res) => {
  res.json({ counter });
});

app.post('/counter/increment', (req, res) => {
  counter++;
  res.json({ counter });
});

app.post('/counter/decrement', (req, res) => {
  counter--;
  res.json({ counter });
});

app.post('/counter/reset', (req, res) => {
  counter = 0;
  res.json({ counter });
});

app.get('/api/last-feedback', (req, res) => {
  const feedbacks = getFeedbacks();
  res.json(feedbacks.length > 0 ? feedbacks[feedbacks.length - 1] : {});
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
