const express = require('express');
const app = express();
const port = process.env.PORT || 8042;

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use('/', express.static(__dirname + '/build', {
  maxAge: '30d'
}));

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log('Server at http://localhost:' + port);
  }
});
