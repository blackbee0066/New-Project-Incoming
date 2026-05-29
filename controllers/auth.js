import bcrypt from 'bcrypt';
import db from '../database/db.js';

//Register User
async function registerUser(req, res) {
    const { fullname, email, password } = req.body;

    if(!fullname || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // to check if a user exists
    try {
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if(existingUser.rows.length > 0 ) {
            return res.status(401).json({
                message: "User already exists, please log in"
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //insert user into database
        await db.query(
            "INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3)",
            [fullname, email, hashedPassword]
        );


        return res.status(200).json({
            message: "Registered successfully"
        });


    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: "server  error"
        });
    }
}

//Login User
async function loginUser(req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            message: "All fiels are required"
        });
    }

    //check if user exists
    try{
        const userExist = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if( userExist.rows.length === 0 ) {
            return res.status(404).json({
                message: "user not found, please register"
            });
        }

        const user = userExist.rows[0];

        //compare inserted password with the hashed password

        const isMatched = await bcrypt.compare(password, user.password);

        if(!isMatched) {
            return res.status(401).json({
                message: "Invalid password or email"
            });
        }

        //save user session
        req.session.user = {
            id:  user.id,
            //email: user.email,
            fullname: user.fullname
        }

        return res.status(200).json({
            message: "Logged in successful",
            user:{
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch(error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}


//Logout Session


export {
    registerUser,
    loginUser
}