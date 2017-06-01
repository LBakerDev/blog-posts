const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


//create a few blog posts to pull data
BlogPosts.create('The Game', 'This is the game', 'LDB', '9/15/15');
BlogPosts.create('Be with us', 'Let the games be with you', 'LDB', '11/21/16');

//send back JSON representation of all recipes on GET requests
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \` ${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const newPost = BlogPosts.create(
        req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(newPost);
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params}) and request body id `
            `(${req.body.id}) must match`);
            console.error(message);
            return res.status(400).send(message);
    }
    console.log(`Updating shopping list item \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).json(updatedItem);
})

router.delete('/:id', (req,res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted recipe \` ${req.params.ID}\``);
    res.status(204).end();
});

module.exports = router;