const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const toDoModel = require('../models/ToDo');
const logger = require('../helpers/loghelper');

// jwt middleware
router.use(verifyToken);


router.post('/create', async (req, res) => {
    const { error, value } = toDoModel.joiRegisterToDo(req.body);
    if (error) {
        logger.error(error);
        return res.status(400).send(error.details[0].message);
    }

    var toDo = new toDoModel({
        description: req.body.description,
        userId: req.currentUser.userId
    });

    try {
        const savedToDo = await toDo.save();
        res.send(savedToDo);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err);
    }
});

router.get('/list', async (req, res) => {
    try {
        const list = await toDoModel.listUserToDos(req.currentUser.userId);
        res.json(list);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err);
    }
});

router.get('/listPaged', async (req, res) => {
    try {
        if (!req.query.pageNumber) {
            req.query.pageNumber = 1;
        };
        if (!req.query.pageSize) {
            req.query.pageSize = 3;
        };
        const list = await toDoModel.listUserToDosPaged(req.currentUser.userId, Number(req.query.pageNumber), Number(req.query.pageSize));
        res.json(list);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err);
    }
});

router.post('/complete/:id', async (req, res) => {
    try {
        if(!(await toDoModel.userHasAccessToEntity(req.params.id, req.currentUser.userId))){
            throw new 'You do not have access to this entity';
        }
        const todo = await toDoModel.completeToDo(req.params.id);
        res.send("Ok");
    } catch (err) {
        logger.error(err);
        res.status(400).send(err);
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        if(!(await toDoModel.userHasAccessToEntity(req.params.id, req.currentUser.userId))){
            throw new 'You do not have access to this entity';
        }
        const todo = await toDoModel.deleteToDo(req.params.id);
        res.send("Ok");
    } catch (err) {
        logger.error(err);
        res.status(400).send(err);
    }
});


module.exports = router;