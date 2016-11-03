// BASIC SETUP

// CALL THE PACKAGES WE NEED
var express = require('express'); // CALL EXPRESS
var app = express(); // DEFINING THE APP
var bodyParser = require ('body-parser'); // CALL BODYPARSER

// CONFIGURE APP USING BODYPARSER
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// SET PORT TO 8080
var port = process.env.PORT || 8080;

// SETUP ROUTES FOR API
var router = express.Router();

router.use(function(req, res, next){
  console.log('Something is happening');
  next();
});

// TEST
router.get('/', function(req, res){
  res.json({message:'It works!'});
});

// USER ROUTES
router.route('/users')
// CREATE A USER
    .post(function(req, res){
      var user = new User(req.body);


// SAVE THE USER & CHECK FOR ERRORS
      user.save(function(err){
        if (err)
            res.send(err);

        res.json({message:'User created'});
      });
    })
// GETTING USERS
    .get(function(req, res){
      User.find(function(err, users){
        if (err)
            res.send(err);
        res.json(users);
      });
    });

// SINGLE-USER ROUTE
router.route('/users/:user_id')
// GETTING A SINGLE USER
    .get(function(req, res){
      User.findById(req.params.user_id, function(err, user){
        if (err)
            res.send(err);
        res.json(user);
      });
    })

// UPDATE A USER
    .put(function(req, res){
      User.findById(req.params.user_id, function(err, user){
        if (err)
            res.send(err);
        user.name = req.body.name;

// SAVING THE USER UPDATE
        user.save(function(err){
        if (err)
            res.send(err);
        res.json({message: 'User updated!'});
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

// note ROUTES
    router.route('/notes')
// CREATE A NOTe
        .post(function(req, res){
          var note = new Note(req.body);


// SAVE THE Notes & CHECK FOR ERRORS
          note.save(function(err){
            if (err)
                res.send(err);

            res.json({message:'note created'});
          });
        })
// GETTING notes
        .get(function(req, res){
          Note.find(function(err, note){
            if (err)
                res.send(err);
            res.json(note);
          });
        });

// SINGLE-note ROUTE
    router.route('/notes/:note_id')
// GETTING A SINGLE note
        .get(function(req, res){
          Note.findById(req.params.note_id, function(err, note){
            if (err)
                res.send(err);
            res.json(note);
          });
        })

// UPDATE A note
        .put(function(req, res){
          Note.findById(req.params.note_id, function(err, note){
            if (err)
                res.send(err);
            note.name = req.body.name;

// SAVING THE note UPDATE
            note.save(function(err){
            if (err)
                res.send(err);
            res.json({message: 'Note updated!'});
            });
          });
        })
// DELETE THE note
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

// START SERVER
app.listen(port);
console.log('Server up and running on ' + port);

// DATABASE CONNECTION
var mongoose = require('mongoose');
mongoose.connect('mongodb://noteless:noteless123@ds139197.mlab.com:39197/notelessdb');

// IMPLEMENTING SCHEMAS
var Note = require('./app/models/notes/note');
var User = require('./app/models/users/user');
