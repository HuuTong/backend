const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const CommentService = require('../../src/service/commentService');
const service = new CommentService();
const router = express.Router();


// create commnet
router.post('/', authMiddleware, (req, res) => {
    const params = req.body;
    const user = req.user;

    service
        .create(user,params)
        .then(data => res.status(200).send(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
});

//fetch all commnet
router.get('/', authMiddleware, (req, res) => {
    let params = req.params;

    service 
        .list(params) 
        .then(data => res.status(200).send(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
});

// show
router.get('/:id', authMiddleware, (req, res) => {
    let params = req.body;
    let id = req.params.id;

    service
        .show(id,params)
        .then(data => res.status(200).send(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
});

router.put('/:id', authMiddleware, (req, res) => {
    let id = req.params.id;
    let params = req.body;

    service
        .update(id, params) 
        .then(data => res.status(200).json(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
})

router.delete('/:id', authMiddleware, (req, res) => {
    let id = req.params.id;

    service
        .del(id)
        .then(data => res.status(200).json(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
})

module.exports = router;