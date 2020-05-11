const router = require('express').Router();
const appUserModel = require('../models/AppUser');
const jsonwebtoken = require('jsonwebtoken');
const logger = require('../helpers/loghelper');


router.post('/register', async (req, res) => {

    const { error, value } = appUserModel.joiRegisterValidate(req.body);
    if (error) {
        logger.error(error);
        return res.status(400).send(error.details[0].message);
    }
    
    const appUser = new appUserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    const emailExists = await appUser.emailExists();
    if (emailExists) {
        return res.status(400).send('Email already exists');
    }
    
    try {
        const savedUser = await appUser.save();
        res.send({ user: savedUser._id });
    } catch (err) {
        logger.error(err);
        res.status(400).send(err);
    }
})


router.post('/login', async (req, res)=> {
    const { error, value } = appUserModel.joiLoginValidate(req.body);
    if (error) {
        logger.error(error);
        return res.status(400).send(error.details[0].message);
    }

    const user = await appUserModel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Email not exists');
    }

    const validPass = await user.validatePassword(req.body.password);
    if(!validPass){
        return res.status(400).send('Invalid password');
    }


    const token = jsonwebtoken.sign({_id : user._id}, process.env.TOKEN_SECRET);
    res.send(token);
});



module.exports = router;