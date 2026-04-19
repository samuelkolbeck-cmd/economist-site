import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Load data from JSON
const projectsPath = path.join(__dirname, 'data', 'projects.json');
const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

const cvPath = path.join(__dirname, 'data', 'cv.json');
const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf8'));

// GET /api/projects
app.get('/api/projects', (req: Request, res: Response) => {
  res.json(projects);
});

// GET /api/cv
app.get('/api/cv', (req: Request, res: Response) => {
  res.json(cvData);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// POST /api/contact
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  console.log('Received message from:', { name, email, message });
  res.status(200).json({ message: 'Message received successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
