const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

const DATA = require('./db.json');

server.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const { users } = DATA;
  
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

server.get('/api/deals', (_req, res) => {
  res.json(DATA.deals);
});

server.delete('/api/deals/:id', (req, res) => {
  const deal = DATA.deals.find(d => d.id === req.params.id);
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  res.json({ message: 'Deal deleted' });
});

server.post('/api/deals', (req, res) => {
  res.json(req.body);
});

server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000');
  console.log('API is available at http://localhost:3000/api');
});