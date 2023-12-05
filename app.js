import express from 'express';
import session from 'express-session';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import e from 'express';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + '/public');
app.use('/public', staticDir);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs.create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
const errorTemplate = await readFile(`${__dirname}/views/error.handlebars`, 'utf8');
hbs.handlebars.registerPartial('error', errorTemplate);

// set up express-session
app.use(
    session({
        name: 'MovieReviewApp',
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: false,
        resave: false,
        cookie: { maxAge: 60000 * 60 * 24 }
    })
);

app.use('/', (req, res, next) => {
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${req.session.user ? 'Authenticated User' : 'Non-Authenticated User'})`);
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            if (!req.originalUrl.startsWith('/admin') && !req.originalUrl.startsWith('/protected') && req.originalUrl !== '/logout') {
                res.redirect('/admin' + req.originalUrl);
            } else {
                next();
            }
        } else if (req.session.user.role === 'user') {
            if (!req.originalUrl.startsWith('/protected') && req.originalUrl !== '/logout') {
                res.redirect('/protected' + req.originalUrl);
            } else {
                next();
            }
        } else {
            throw `Invalid user role: ${req.session.user.role}`;
        }
    } else {
        if (req.originalUrl !== '/login' && req.originalUrl !== '/register') {
            res.redirect('/login');
        } else {
            next();
        }
    }
});

app.use('/login', (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            res.redirect('/admin' + req.originalUrl);
        } else if (req.session.user.role === 'user') {
            res.redirect('/protected' + req.originalUrl);
        }
    } else {
        next();
    }
});


app.get('/register', (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            res.redirect('/admin' + req.originalUrl);
        } else if (req.session.user.role === 'user') {
            res.redirect('/protected' + req.originalUrl);
        }
    } else {
        next();
    }
});

app.get('/protected', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
});

app.get('/admin', (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            next();
        } else {
            return res.status(403).render('error', {
                code: 403,
                error: 'user does not have permission to view the page',
            });
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});