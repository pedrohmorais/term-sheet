const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock-server/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const users = require('./mock-server/db.json').users;
  
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000');
  console.log('API is available at http://localhost:3000/api');
});