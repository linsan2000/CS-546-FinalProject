import express from 'express';
const app = express();
import session from 'express-session';
import exphbs from 'express-handlebars';
import configRoutes from './routes/index.js';

// set up express-session
app.use(
    session({
        name: 'MovieReviewApp',
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: false,
        resave: false,
        cookie: {maxAge: 60000}
    })
);

app.use('/private', (req, res, next) => {
    console.log(req.session.id);
    if (!req.session.user) {
        return res.redirect('/');
    } else {
        next();
    }
});

app.use('/login', (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/private');
    } else {
        //here I',m just manually setting the req.method to post since it's usually coming from a form
        req.method = 'POST';
        next();
    }
});
  

// set up default 
const staticDir = express.static('public');
app.use('/public', staticDir);

// const handlebarsInstance = exphbs.create({
//   defaultLayout: 'main',
//   // Specify helpers which are only registered on this instance.
//   helpers: {
//     asJSON: (obj, spacing) => {
//       if (typeof spacing === 'number')
//         return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

//       return new Handlebars.SafeString(JSON.stringify(obj));
//     },

//     partialsDir: ['views/partials/']
//   }
// });
// app.engine('handlebars', handlebarsInstance.engine);
// app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});