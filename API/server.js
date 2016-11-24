// BASIC SETUP

// CALL THE PACKAGES WE NEED
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport  	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/users/user'); // get the mongoose model
var port        = process.env.PORT || 8080; // SET PORT TO 8080
var jwt         = require('jwt-simple');
var cors = require('cors');

app.use(cors());

// CONFIGURE APP USING BODYPARSER
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

app.use(function (req, res, next) {
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

// SETUP ROUTES FOR API
var router = express.Router();

router.use(function(req, res, next){
  console.log('Something is happening');
  next();
});



// START SERVER
app.listen(port);
console.log('Server up and running on ' + port);

// DATABASE CONNECTION
mongoose.Promise = global.Promise
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);
// TEST
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

//Userinfo

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
router.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      _id: decoded._id
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json(user);
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

getToken = function (headers) {
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


// USER ROUTES
// CREATE A USER
router.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User(req.body);
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      if (!err){
        User.find()
        .exec(function(err, user) {console.log(JSON.stringify(user, null, "\t"))})
        res.json({success: true, msg: 'Successful created new user.'});
      }
    });
  }
});


router.route('/users')

    .post(function(req, res){
      var user = new User(req.body);


// SAVE THE USER & CHECK FOR ERRORS
      user.save(function(err){
        if (err)
            res.send(err);
        if (!err){
            User.find({})
            .exec(function(err, user) {console.log(JSON.stringify(user, null, "\t"))})
            res.json({message:'User created'});
        }
      });
    })
// GETTING USERS
    .get(function(req, res){
      User.find(function(err, users){
        if (err)
            res.send(err);
        if (!err){
            User.find({})
            .exec(function(err, user) {console.log(JSON.stringify(user, null, "\t"))})
            res.json(users);
        }

      });
    });

// SINGLE-USER ROUTE
router.route('/users/:user_id')
// GETTING A SINGLE USER
    .get(function(req, res){
      User.findById(req.params.user_id, function(err, user){
        if (err)
          return res.send(err);
        if (!err){
            User.findById(req.params.user_id)
            .exec(function(err, user) {console.log(JSON.stringify(user, null, "\t"))})
            return res.json(user);
        }

      });
    })

// UPDATE A USER
    .put(function(req, res){
      User.findById(req.params.user_id, function(err, user){
        if (err)
            return res.send(err);
            //var user = User(req.body); this breaks it
            user.name = req.body.name;
            user.email = req.body.email;
            user.fullname = req.body.fullname;
            user.occupation = req.body.occupation;
        		user.email = req.body.email;
// SAVING THE USER UPDATE
        user.save(function(err){
          if (err)
            return res.send(err);
          if (!err){
            User.findById(req.params.user_id)
            .exec(function(err, user) {console.log(JSON.stringify(user, null, "\t"))})
            res.json({message: 'User updated!'});
          }
        });
      });
    })
// DELETE THE USER
    .delete(function(req, res){
      User.remove({
        _id: req.params.user_id
      }, function(err, user){
        if (err)
            res.send(err);
        res.json({message: 'User deleted!'});
      });
    });


//Authentication route
router.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});



// NOTES ROUTES
    router.route('/notes')
// CREATE A NOTES
        .post(function(req, res){
          var note = new Note(req.body);


// SAVE THE NOTES & CHECK FOR ERRORS
          note.save(function(err){
            if (err)
                res.send(err);
            if (!err){
              Note.find({}).
              populate('owner').
              exec(function(err, note) {console.log(JSON.stringify(note, null, "\t"))})
                  res.json({message:'note created'});
              }
          });
        })
// GETTING NOTES
        .get(function(req, res){
          Note.find(function(err, note){
            if (err)
                res.send(err);
            if (!err) {
              Note.find({})
              .exec(function(err, note) {console.log(JSON.stringify(note, null, "\t"))})
              res.json(note);
            }
          });
        });

// SINGLE-NOTES ROUTE
    router.route('/notes/:note_id')
// GETTING A SINGLE NOTES
        .get(function(req, res){
          Note.findById(req.params.note_id, function(err, note){
            if (err)
                res.send(err);
            if (!err){
              Note.findById(req.params.note_id)
              .exec(function(err, note) { console.log(JSON.stringify(note, null, "\t")) })
              res.json(note);
            }
          });
        })

// UPDATE NOTES
        .put(function(req, res){
          Note.findById(req.params.note_id, function(err, note){
            if (err)
                res.send(err);
            note.title = req.body.title;
            note.content = req.body.content;

// SAVING THE NOTES UPDATE
            note.save(function(err){
              if (err)
                  res.send(err);
              if (!err){
                  Note.findById(req.params.note_id)
                  .exec(function(err, note) { console.log(JSON.stringify(note, null, "\t")) })
                  res.json({message: 'Note updated!'});
              }
            });
          });
        })
// DELETE THE NOTES
        .delete(function(req, res){
          Note.remove({
            _id: req.params.note_id
          }, function(err, note){
            if (err)
                res.send(err);
            res.json({message: 'Note deleted!'});
          });
        });


        // REGISTERING ROUTES
        app.use('/api', router);



// IMPLEMENTING SCHEMAS
var Note = require('./app/models/notes/note');
var User = require('./app/models/users/user');
