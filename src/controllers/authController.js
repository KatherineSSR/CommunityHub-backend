
const bcrypt = require('bcrypt');
const User = require('../models/User');

const register = async (req, res) => {
    try {

        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).end();
        }

        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
            return res.status(409).end();
        }

        // Convertimos la contraseña en hash 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creamos el usuario con los datos finales 
        const user = await User.createUser({
            username,
            password: hashedPassword,
            email
        });

        return res.status(201).location(`/api/auth/users/${user._id}`).end();
    } catch (error) {
        return res.status(500).end();
    }
};