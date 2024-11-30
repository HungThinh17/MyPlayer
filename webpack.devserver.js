const setupMiddlewares = (middlewares, devServer) => {
  // Log all requests
  devServer.app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
  });

  // Handle POST requests to /log endpoint
  devServer.app.post('/log', (req, res) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      const { logs } = JSON.parse(data);
      console.log('Client log:', ...logs);
      res.status(200).send('Log received');
    });
  });

  return middlewares;
};

module.exports = setupMiddlewares;
