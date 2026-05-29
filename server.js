import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

// Import routes
import routes from "./routes/routes.js";
import { loginUser, registerUser } from "./controllers/auth.js";
//import db from './database/db.js';

// ----------------------
// Middleware
// ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "key9819",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Serve static files
app.use(express.static(join(__dirname, "public")));

// ----------------------
// Routes
app.post('/', (req, res) =>{
    res.sendFile(join(__dirname, 'public', 'home.html'));
});

app.post('/register', registerUser);

app.post('/login', loginUser);

app.post('/logout', (req, res) => {

    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "logout error" });

        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });

        res.status(200).json({ 
            message: "Logged out successfully" 
        });
    });
    
});

// ----------------------
app.use("/", routes);

// ----------------------
// Start Server
// ----------------------
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
