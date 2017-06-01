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

//adding blogPosts for use with app+



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});