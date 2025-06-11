const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const USERS_FILE = 'users.json';
const ENTRIES_FILE = 'entries.json';

function loadJson(path) {
  if (!fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function saveJson(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

async function sendConfirmationEmail(email, token) {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const info = await transporter.sendMail({
    from: 'noreply@example.com',
    to: email,
    subject: 'Confirm your account',
    text: `Click the link to confirm: http://localhost:${PORT}/confirm/${token}`,
    html: `<p>Click <a href="http://localhost:${PORT}/confirm/${token}">here</a> to confirm your account.</p>`
  });

  console.log('Confirmation email sent:', nodemailer.getTestMessageUrl(info));
}

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const users = loadJson(USERS_FILE);
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const token = uuidv4();
  const user = { id: uuidv4(), email, passwordHash, verified: false, token };
  users.push(user);
  saveJson(USERS_FILE, users);
  await sendConfirmationEmail(email, token);
  res.json({ message: 'Registration successful. Check console for confirmation email link.' });
});

app.get('/confirm/:token', (req, res) => {
  const { token } = req.params;
  const users = loadJson(USERS_FILE);
  const user = users.find(u => u.token === token);
  if (!user) return res.status(400).send('Invalid token');
  user.verified = true;
  delete user.token;
  saveJson(USERS_FILE, users);
  res.send('Email confirmed. You can now log in.');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = loadJson(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.verified) return res.status(400).json({ error: 'Email not confirmed' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });
  res.json({ id: user.id, email: user.email });
});

app.get('/entries', (req, res) => {
  const userId = req.query.userId;
  const entries = loadJson(ENTRIES_FILE).filter(e => e.userId === userId);
  res.json(entries);
});

app.post('/entries', (req, res) => {
  const { userId, entry } = req.body;
  if (!userId || !entry) return res.status(400).json({ error: 'Missing data' });
  const entries = loadJson(ENTRIES_FILE);
  entries.push({ userId, ...entry });
  saveJson(ENTRIES_FILE, entries);
  res.json({ message: 'Entry saved' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
