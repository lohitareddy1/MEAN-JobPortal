var express = require('express'),
    app = express(),
    // mongoClient = require('mongodb').MongoClient,
    // mongo_obj = "",
    bodyParser = require('body-parser'),
    // mongojs = require('mongojs'),
    // data = mongojs('marlabs');
    mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/marlabs');//connect the db
var db = mongoose.connection;//db instance, use this to listen for events
db.on('error', function () {
    console.log('Error')
});
db.on('open', function () {
    console.log("success");

});

/*
User schema which allows for the user to register
*/

var userschema = mongoose.Schema({
    "username": String,
    "password": String,
    "email": String,
    "location": String,
    "phone": String,
    "usertype": String,
    "isLoggedIn": {
        type: Boolean,
        default: false
    }
});
var User = mongoose.model('user', userschema);//model the schema to a collection


/*
Job schema which allows for company users to post jobs
*/
var jobsSchema = mongoose.Schema({
    "title":{ type: String, lowercase: true,},
    "description":  { type: String, lowercase: true, trim: true },
    "keyword":  { type: String, lowercase: true, trim: true },
    "location":  { type: String, lowercase: true, trim: true }

});
var Job = mongoose.model('jobs', jobsSchema);//model the schema to a collection

app.use(bodyParser.json());
app.use(express.static('public'));


/*
Route for the default page. This is the page where angular is hosted
*/
app.get('/', function (req, res) {

    res.sendFile(__dirname + '/main.html');
});


/*
API used to search the jobs colleciton based on the input of the user
:word indicates the value of the input provided by the user
*/
app.post('/api/search', function (req, res) {
    
    console.log(new RegExp(req.body.title, "i"));
    console.log(new RegExp(req.body.keyword, "i"));
    console.log(new RegExp(req.body.location, "i"));
    var title= req.body.title.toLowerCase();
    var keyword= req.body.keyword.toLowerCase();
    var location= req.body.location.toLowerCase();
    console.log(title);
    Job.find( {
        $or:[ 
            {'title': title}, 
            {'keyword':  keyword},
            {'location': location}
        ]
    }, function (err, result) {
        if (!err) {
            res.send({ 'data': result });
        }
    })
});



/*
Used to authenticate the user to be looged in by setting the flag to be true, for now the status of this API is on hold
*/
app.put('/authenticate/:user', function (req, res) {
    console.log(req.params);
    console.log(req.body);
    var user = req.params.user;
    User.findOneAndUpdate({ username: user }, { $set: { isLoggedIn: true } }, function (err, data) {
        if (!err) {
            res.send({ 'flg': 'success' });
        }
        else {
            res.send("User not logged in");
        }
    })
})


/*
This API is used to validate the user credentials
*/
app.post('/validateuser', function (req, res) {

    var user = req.params.user;
    User.findOne({ username: req.body.username, password: req.body.password }, function (err, data) {
        if (!err) {
            if (data) {
                res.send({ 'flg': 'success', 'user': data });
                console.log(data)
            }
            else {
                res.send({ 'flg': 'fail' })
            }
        }
        else {
            res.send("Invalid Username or password");
        }
    })

})

/*
This API is used to post a job to the jobs colleciton
*/
app.post('/createjob', function (req, res) {

    let job = new Job(req.body);
    
    job.save((err, createJobObject) => {
        if (err) {
            res.status(500).send(err);
        }
        res.send({ 'flg': 'success' });
    });

})

/*
Assuming that there is only one user logged in at a particular point in time.
API used to get the user object that is logged in.
Will be called when ever the page refreshes or a new page loads
*/

app.get('/loggedUser', function (req, res) {
    User.findOne({ isLoggedIn: true }, function (err, data) {
        if (!err) {
            res.send(data);
            console.log(data);
        }

    })
})


/*
Create a new user by inserting the user object into the user collection
*/

app.post('/createuser', function (req, res) {


    let user = new User(req.body);
    user.save((err, createUserObject) => {
        if (err) {
            res.status(500).send(err);
        }

        res.send({ 'flg': 'success' });
    });
});

/*
API to log the user out and reset the credentials
*/

app.put('/logout/:user', function(req, res){
var user = req.params.user;
    User.findOneAndUpdate({username:user},{$set:{isLoggedIn:false}}, function(err, docs){
        res.send(docs);
        
    })

})
/*
App listening on the port. This indicates the backend port on which the server runs
*/
var port = 3000;
app.listen(port, function () {
    console.log("Server started");

});