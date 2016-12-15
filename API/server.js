// Basic Setup

// Call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database'); // Get DB config file
var User = require('./app/models/users/user'); // Get the Mongoose model
var port = process.env.PORT || 8080; // Set port to 8080
var jwt = require('jwt-simple');
var cors = require('cors');
var _ = require('lodash');

app.use(cors());

// Configure app using Bodyparser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});

// Use the passport package in our application
app.use(passport.initialize());

// Setup Routes for API
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening');
    next();
});

// Start server
app.listen(port);
console.log('Server up and running on ' + port);

// Database connection
mongoose.Promise = global.Promise
mongoose.connect(config.database);

// Pass passport for configuration
require('./config/passport')(passport);
// TEST
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

//User info

// Route to restricted info (GET http://localhost:8080/api/memberinfo)
router.get('/memberinfo', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. User not found.'
                });
            } else {
                res.json(user);
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'No token provided.'
        });
    }
});

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};


// User routes
// Create a user
router.post('/signup', function(req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({
            success: false,
            msg: 'Please pass name and password.'
        });
    } else {
        var newUser = new User(req.body);
        // Save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Username already exists.'
                });
            }
            if (!err) {
                User.find()

                res.json({
                    success: true,
                    msg: 'Successful created new user.'
                });
            }
        });
    }
});


router.route('/users')
    // Create a new User
    .post(function(req, res) {
        var user = new User(req.body);

        // Save the user & check for errors
        user.save(function(err) {
            if (err)
                res.send(err);
            if (!err) {
                User.find({})

                res.json({
                    message: 'User created'
                });
            }
        });
    })
    // Getting users
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            if (!err) {
                User.find({})

                res.json(users);
            }

        });
    });

// Single-user route
router.route('/users/:user_id')
    // Getting a single user
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                return res.send(err);
            if (!err) {
                User.findById(req.params.user_id)

                return res.json(user);
            }

        });
    })

// Update a user
.put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                return res.send(err);
            //var user = User(req.body); this breaks it
            //added req.body to if statement to check for empty data, this will help that no empty/undefined data will be handled
            if (req.body.name) {
                user.name = req.body.name;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.fullname) {
                user.fullname = req.body.fullname;
            }
            if (req.body.occupation) {
                user.occupation = req.body.occupation;
            }
            if (req.body.email) {
                user.email = req.body.email;
            }

            // Saving the user update
            user.save(function(err) {
                if (err)
                    return res.send(err);
                if (!err) {
                    User.findById(req.params.user_id)

                    res.json({
                        message: 'User updated!'
                    });
                }
            });
        });
    })
    // Delete the user
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            if (!err) {
                res.json({
                    message: 'User deleted!'
                });
            }
        });
    });

//Friends route
router.route('/friends/:name')
    //Send frindrequest and update the user friendlist

.put(function(req, res) {
    //instantiate the token
    var token = getToken(req.headers);
    //if there is a token then decrypt it
    if (token) {
        var decoded = jwt.decode(token, config.secret);
    }
    // User.Find({
    //   name: req.params.name
    // }, function(user) {
    //   console.log("user", user);
    // })
    //Find the id of the requested friend name
    User.findOne({
        name: req.params.name
    }, function(err, user) {
        if (err)
            res.send(err)
        if (!err) {
            //set the requester to be equal to the id from the token
            var requester = decoded._id;
            //set the accepter to be equal to the id mathing the name
            var accepter = user._id;
            console.log('accepter', req.params.name);
            console.log('requester', decoded.name);
            user.save(function(err) {
                if (err)
                    res.send(err)
                if (!err) {
                    //sets a variable to push the changes to the friendslist array
                    var update1 = {
                        $push: {
                            'friendslist': {
                                'friendId': accepter,
                                'friendName': req.params.name,
                                'status': 'Requested'
                            }
                        }
                    };
                    //find the requesters and updates the friendslist array
                    User.findOneAndUpdate({
                        '_id': requester
                    }, update1, function(err) {
                        if (err)
                            res.send(err)
                        if (!err) {
                            //sets a variable to push the changes to the friendslist array
                            var update2 = {
                                $push: {
                                    'friendslist': {
                                        'friendId': requester,
                                        'friendName': decoded.name,
                                        'status': 'Pending'
                                    }
                                }
                            };
                            //find the accepters user and updates the friendslist array
                            User.findOneAndUpdate({
                                '_id': accepter
                            }, update2, function(err) {
                                res.json({
                                    message: 'Friendship request sent!'
                                });
                            });
                        }
                    });



                }
            });


        }


    });
});

router.route('/friends/search/:name')
    .get(function(req, res) {
        //var query = {};
        //query.search = new RegExp(req.params.name, 'i');
        User.find({
            'name': req.params.name
        }, function(err, user) {
            if (err)
                res.send(err);
            if (!err)
                res.json(user);
        });
    });

router.route('/friends/status/:_id/:status')

//Send frindrequest and update the user friendlist
.put(function(req, res) {

    //instantiate the token
    var token = getToken(req.headers);
    //if there is a token then decrypt it
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        // console.log(req.body._id);
    }
    //Find the id of the requested friend name

    User.findOne({
        '_id': decoded._id
    }, function(err, user) {
        if (err)
            res.send(err);
        if (user) {
            //returns an array of friendships matcing the request parameters
            var friendships = _.filter(user.friendslist, function(obj) {
                return obj._id == req.params._id;

            });

            //if the length is over 0 then transform the array into a single object
            if (friendships.length > 0) {
                var friendship = friendships[0];

                //the requesters friendId
                var friendToBe = friendship.friendId;

                //the id of the person who is accepting the friend request
                var accepter = decoded._id;

                var accepterList = req.params._id;
                //the status of the request
                var status = req.params.status;


                User.findOne({
                    '_id': friendToBe
                }, function(err, user) {
                    // if(err)
                    // res.send(err);
                    // console.log("are we here", user);

                    //returns the friendlist of the friendtobe where the accepters ID exists
                    var alienFriendships = _.filter(user.friendslist, function(obj2) {
                        return obj2.friendId == accepter;
                    });

                    if (alienFriendships.length > 0) {
                        var alienFriendship = alienFriendships[0]._id;


                        //find the requesters and updates the friendslist array
                        User.findOne({
                            '_id': accepter
                        }, function(err, user1) {
                            if (err)
                                res.send(err);

                            if (!err) {
                                var friendslist1 = user1.friendslist.id(accepterList);
                                friendslist1.status = status;
                                return user1.save();
                            }
                        });

                        //find the accepters user and updates the friendslist array
                        User.findOne({
                            '_id': friendToBe
                        }, function(err, user2) {
                            if (err)
                                res.send(err);
                            if (!err) {
                                var friendslist2 = user2.friendslist.id(alienFriendship);
                                friendslist2.status = status;
                                return user2.save();
                            }

                        });

                        res.json({
                            success: true,
                            message: 'Friendship status has changed'
                        });

                    }

                });

            }

        }
    });
});

//Authentication route
router.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({
                success: false,
                msg: 'Authentication failed. User not found.'
            });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    res.send({
                        success: false,
                        msg: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
});



// Notes routes
router.route('/notes')
    // Create a Note
    .post(function(req, res) {
        //the request is sent with a JWT to identify the user
        var token = getToken(req.headers);
        //if there is a token then decrypt it
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            //find the user id of the token received
            console.log('Her er dit user id' + decoded._id)
        }
        var note = new Note(req.body);
        note.owner = decoded._id;
        note.ownerFullname = decoded.name;

        // Save the notes & check for errors
        note.save(function(err, note) {
            if (err)
                res.send(err);
            if (!err) {

                console.log(JSON.stringify(note, null, "\t"))
                res.json({
                    success: true,
                    message: 'Note created!'
                });
            }

        });
    })
    // Getting notes
    .get(function(req, res) {
        //The request is sent with a JWT to identify the user
        var token = getToken(req.headers);
        //If there is a token then decrypt it
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            //Find the user id of the token received
            console.log('Her er dit user id' + decoded._id)
        }




        Note.find({
            owner: decoded._id
        }, function(err, note) {
            if (err)
                res.send(err);
            if (!err) {
                Note.find({
                    shared: decoded._id
                }, function(err, note2) {
                    if (err)
                        res.send(err);
                    if (!err) {
                        var stackedNotes = _.concat(note, note2);
                        res.send(stackedNotes);
                    }
                });
            }
        });
    });

// Single-notes route
router.route('/notes/:note_id')
    // Getting a single route
    .get(function(req, res) {
        Note.findById(req.params.note_id, function(err, note) {
            if (err)
                res.send(err);
            if (!err) {
                Note.findById(req.params.note_id)
                    .exec(function(err, note) {
                        console.log(JSON.stringify(note, null, "\t"))
                    })
                res.json({
                    message: 'Here is the note you asked for!'
                });
            }
        });
    })
    // Update notes
    .put(function(req, res) {
        Note.findById(req.params.note_id, function(err, note) {
            if (err)
                res.send(err);
            if (req.body.title) {
                note.title = req.body.title;
            }
            if (req.body.content) {
                note.content = req.body.content;
            }
            if (req.body.owner) {
                note.owner = req.body.owner;
            }
            if (req.body.date) {
                note.date = req.body.date;
            }
            if (req.body.shared) {
                note.shared = req.body.shared;
            }

            note.save(function(err) {
                if (err)
                    res.send(err);
                if (!err) {
                    Note.findById(req.params.note_id)
                        .exec(function(err, note) {
                            console.log(JSON.stringify(note, null, "\t"))
                        })

                    res.json({
                        success: true,
                        msg: note.shared,

                    });
                }
            });
        });
    })
    // Delete the notes
    .delete(function(req, res) {
        Note.findById(req.params.note_id, function(err, note) {
            if (err)
                res.send(err)
            if (!err) {
                //The request is sent with a JWT to identify the user
                var token = getToken(req.headers);
                //If there is a token then decrypt it
                if (token) {
                    var decoded = jwt.decode(token, config.secret);
                }
                var owner = note.owner;
                var requester = decoded._id;
                if (owner == requester) {
                    Note.remove({
                        _id: req.params.note_id
                    }, function(err, note) {
                        if (err)
                            res.send(err);
                        if (!err) {
                            res.send({
                                success: true,
                                msg: 'Note deleted!'
                            });
                        }
                    });
                } else {
                    res.send({
                        succes: false,
                        msg: 'You do not have privilege to delete this note! '
                    });
                }
            }
        })
    });

// Registering routes
app.use('/api', router);


// Implementing schemas
var Note = require('./app/models/notes/note');
var User = require('./app/models/users/user');
