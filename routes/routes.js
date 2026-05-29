import { Router } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const router = Router();

// Emulate __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Routes
router.get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'home.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'signup.html'));
});

//protected splitter route example
router.get('/mini_splitter', (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    res.sendFile(join(__dirname, '..', 'public', 'mini_splitter.html'));
});

// EXPORT CORRECTLY (no parentheses)
export default router;
