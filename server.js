const express = require('express');
const app = express();
const socket = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const engine = require('ejs-locals');
var session = require('express-session');

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'secretsession',
    saveUninitialized: true,
    resave: false,
    cookie: { secure: !true }
}));

//set the template engine ejs
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// DB config
const db = require('./config/keys').mongoURI;
// connect to MongoDB(mLab)
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('Connected with mLab'))
    .catch(err => console.log(err));

const users = require('./routes/users');

// use of routes
app.use('/', users);

//Listen on port 3000
var server = app.listen(3000);

const io = socket(server);

//routes
app.get('/', (req, res) => {
    res.render('index');
});

// make user object global in all views
app.get('*', function(req, res, next){
    res.locals.user = req.user;
    next();
});

io.on('connection', (socket) => {
    console.log('Connected');
    socket.on('chat', (data) => {
        // console.log(data);
        io.sockets.emit('chat-recieved', data);
    })

    // listen for typing event
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    })
    //socket.emit('chat', { hello: 'world' });
})
