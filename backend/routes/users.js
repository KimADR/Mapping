const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // Save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.error(err); // Log the error to the console
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Login

router.post('/login', async (req, res) => {
    try {
        // Check if the user exists
        const user = await User.findOne({username: req.body.username});
        !user && res.status(400).json("Wrong username or password!");

        // Check if the password is correct
        const validPassword = await bcrypt.compare(
        req.body.password, 
        user.password
    );
    !validPassword && res.status(400).json("Wrong username or password!");

        // Respond
        res.status(200).json({_id: user._id, username: user.username});
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;