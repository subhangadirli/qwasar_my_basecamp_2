const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const multer = require('multer');
const app = express();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    app.set('trust proxy', 1);
}

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (!isProduction && /^http:\/\/localhost:\d+$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'mybasecamp_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

const usersRouter = require('./routes/user');
const sessionsRouter = require('./routes/sessions');
const projectsRouter = require('./routes/projects');

app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/projects', projectsRouter);

const distDir = path.join(__dirname, 'frontend', 'dist');
if (isProduction && fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get(/^\/(?!api\/).*/, (req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
    });
}

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message === 'Only png/jpg/pdf/txt formats are allowed') {
        return res.status(400).json({ error: err.message });
    }
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
});

const { init } = require('./models');

const PORT = process.env.PORT || 8080;
init()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

module.exports = app;
