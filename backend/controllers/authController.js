const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const foundUser = await User.findOne({ username }).select('+password').exec();

        if (!foundUser || !foundUser.active) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const match = await bcrypt.compare(password, foundUser.password);

        if (!match) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // If credentials are valid, generate and send tokens
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    teams: foundUser.teams,
                    id: foundUser.id
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username, teams: foundUser.teams, id:foundUser.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Create secure cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true, // accessible only by the web server
            secure: true, // https
            sameSite: 'None', // cross-site cookie
            maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match refreshToken expiresIn
        });

        // Send accessToken containing username and roles
        res.json({ accessToken });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "teams": foundUser.teams,
                        "id": foundUser.id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Register a new user
// @route POST /auth/register
// @access Public
const register = async (req, res) => {
    try {
        const { username, password, roles, team } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the username is already taken
        const existingUser = await User.findOne({ username }).exec();
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            active: true, // You can set the initial active state based on your requirements
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with success message or any additional information
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('User Registration Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    register,
    logout
}