const user = require('../model/user');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

function isInValid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    signup: async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            if (isInValid(name) || isInValid(email) || isInValid(password)) {
                return res.status(400).json({ err: 'Make sure to fill all the details' });
            } else {
                const User = await user.findOne({ where: { email: email } });
                if (User) {
                    res.status(200).json("Email already registered");
                } else {
                    const saltrounds = 10;
                    bcrypt.hash(password, saltrounds, async (err, hash) => {
                        console.log(err);
                        await user.create({ name, email, password: hash });
                        res.status(201).json({ message: 'User created successfully' });
                    });
                }
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    },
    generateAccessToken: function(id, name, ispremiumuser) {
        return jwt.sign(
            { userid: id, name: name, ispremiumuser},
            process.env.TOKEN_SECRET
        );
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (isInValid(email) || isInValid(password)) {
                return res.status(400).json({ message: 'Email or password is missing', success: false });
            }
            const User = await user.findOne({ where: { email: email } });
            if (User) {
                bcrypt.compare(password, User.password, (err, result) => {
                    if (err) {
                        throw new Error('something went wrong');
                    }
                    if (result === true) {
                        res.status(201).json({
                            success: true,
                            message: 'User logged in successfully',
                            token: module.exports.generateAccessToken(User.id, User.name, User.ispremiumuser)
                        });
                    } else {
                        res.status(400).json({ success: false, message: 'Email or Password is incorrect' });
                    }
                });
            } else {
                res.status(404).json({ success: false, message: 'User does not exist!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    },
    sync: async () => {
        try {
            await sequelize.sync();
        } catch (err) {
            console.log(err);
        }
    }
};
