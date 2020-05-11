const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const _model = 'ToDo';

const toDoSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    description: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    lastUpdateDate: {
        type: Date
    }
});

toDoSchema.statics.joiRegisterToDo = function (obj) {
    const schema = Joi.object({
        description: Joi.string().max(500).required()
    });
    return schema.validate(obj);
};

toDoSchema.statics.listUserToDos = async function (userId) {
    return await this.model(_model).find({ userId: userId, isDeleted: false }, 'description isCompleted');
};

toDoSchema.statics.listUserToDosPaged = async function (userId, pageNumber, pageSize) {
    if (pageNumber == 0) {
        pageNumber = 1;
    }
    return await this.model(_model).find({ userId: userId, isDeleted: false }, 'description isCompleted createDate', 
    { skip: (pageNumber - 1) * pageSize, limit: pageSize, sort: { createDate: -1 } });
};

toDoSchema.statics.completeToDo = async function (id) {
    return await this.model(_model).findOneAndUpdate({ _id: id }, { isCompleted: true, lastUpdateDate: Date.now() });
};

toDoSchema.statics.deleteToDo = async function (id) {
    return await this.model(_model).findOneAndUpdate({ _id: id }, { isDeleted: true, lastUpdateDate: Date.now() });
};




module.exports = mongoose.model(_model, toDoSchema);
