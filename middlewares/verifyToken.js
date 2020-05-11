const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../models/AppUser');

module.exports = async function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        const user = await userModel.findById(verified._id);
        req.currentUser = { userId : user._id, name : user.name, email: user.email };
        next();
    } catch (error) {
        return res.status(401).send('Access denied');
    }
}