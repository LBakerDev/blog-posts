const chai = require('chai');
const chaiHttp = require('chai-http');

const{app, runServer, closeServer} = require('../server');

//this allows us to use 'should' style syntax in our tests
//so that we can do things like '(1+1).should.equal(2);
const should = chai.should();

chai.use(chaiHttp);

describe('blogposts', function() {
    //before the tests run, we activate the server. The 'runServer'
    //function returns a promise, and we return the promise by doing 
    //'return runServer'. If we didn't return a promise here, there's
    // a possibility of a race condition where our tests start running
    // before our server has started.
    before(function() {
        return runServer();
    });

    //Close server after these tests run in case we have other
    //test modules that need to call 'runServer'. If server is already
    //running, 'runServer' will error out.
    after(function() {
        return closeServer();
    });
    //'chai.request.get' is an asynchronous operation. Therefore
    // we would either return an promise of else bass a 'done' callback
    // to the test we call at the end. We'll use the first approach. 
    it('should list users on GET', function() {
        return chai.request(server)
        .get('/blogposts')
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);
            const expectedKeys =('id', 'title', 'author', 'content', 'publishDate') 
            res.body.forEach(function(item) {
                item.should.be.a('object');
                item.should.include.keys(expectedKeys);
            });
        });
    });

    // test strategy:
    // 1. make a POST request with data for a new item
    // 2. inspect response object and prove it has right status
    // code and that the returned object has an 'id'
    it('should add an item on POST', function() {
        const newItem = {title: 'my story'};
        return chai.request(app)
        .post('/blogposts')
        .send(newItem)
        .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'title', 'author', 'content', 'publishDate');
            res.body.id.should.not.be.null;
            // response should be deep equal to 'newItem' from above if we assign
            // 'id' to if from 'res.body.id'
            res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}))
        });
    });

    // test strategy:
    // 1. initiallize some update data (we won't have an 'id' yet)
    // 2. make a GET request so we can get an item to update
    // 3. add the 'id' to 'updateData'
    // 4. Make a PUT request with 'updateData'
    // 5. Inspect the response object to ensure it
    // has right status code and that we get back an updated
    // item with the right data in it
    it('should update items on PUT', function() {
        // we initialize our updateData here and then after the initial
        // request to the app, we update it with an 'id' property so
        //we can make a second, PUT call to the app.
        const updateData = {
            title: 'bridge'
        }

        return chai.request(app)
            //first we have to get so we have an idea of object to update
            .get('blogposts')
            .then(function(res) {
                updateData.id = res.body[0].id;
                // this returns an promise whose value will be the response
                // object, which we can inspect in the next 'then' back. 
                return chai.request(app)
                .put(`/blogposts/${updateData.id}`)
                .send(updateData);
            })
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.equal(updateData);
            });
    });
            it('should delete items on DELETE', function() {
                return chai.request(app)
                // first have to get so we have an 'id' of item to delete
                .get('/blogposts')
                .then(function(res) {
                    return chai.request(app)
                    .delete(`/blogposts/${res.body[0].id}`);
                })
                .then(function(res) {
                    res.should.have.status(204);
                });
            });
        });