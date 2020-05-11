const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const _model = 'AppUser';
const salt = bcrypt.genSaltSync(10);

const appUserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    registerDate: {
        type: Date,
        default: Date.now
    }
});

appUserSchema.statics.joiRegisterValidate = function (obj) {
    const schema = Joi.object({
        name: Joi.string().min(8).max(255).required(),
        email: Joi.string().min(8).max(255).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(obj);
};

appUserSchema.methods.emailExists = async function () {
    return await this.model(_model).findOne({ email: this.email });
}

appUserSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

appUserSchema.statics.joiLoginValidate = function (obj) {
    const schema = Joi.object({
        email: Joi.string().min(8).max(255).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(obj);
};


appUserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

module.exports = mongoose.model(_model, appUserSchema);