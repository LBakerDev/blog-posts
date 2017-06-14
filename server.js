const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const Blogposts = require('./models');
const blogPostsRouter = require('./blogPostsRouter');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));
app.use("/blogposts", blogPostsRouter);

//both runServer and closeServer need to access the same
//server object. Therefore we declare 'server' here and then
//when runServer runs, it assigns a value.

let server;

//this function starts the server and returns a Promise.
//In the test code, we need a way of asynchronously starting
//the server given the promises will be there.
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like 'runServer', this function also needs to return an promise.
//'server.close' does not return a promise on its own, so we manually
//create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't call 'resolve()'
        return;
      }
      resolve();
    });
  });
}

//if server.js is called directly ('as with 'node server.js'), this block
//runs. But we also export the runServer command so other code ( for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};