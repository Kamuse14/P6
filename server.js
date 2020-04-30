const http = require('http');
const app = require('./app'); //on importe l'application

const normalizePort = val => { // renvoie un port valide
  const port = parseInt(val, 10); // un nombre (pas un string)

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // on dit au serveur sur quel port elle doit tourner

const errorHandler = error => { //recherche les différentes erreurs et les gère
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => { //écouteur d'évènements consignant le port sur lequel le serveur s'exécute
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); //si l'environnement sur lequel tourne le serveur envoie un port à utiliser, sinon 3000 par défaut

