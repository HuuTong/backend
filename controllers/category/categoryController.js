const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const CategoryService = require('../../src/service/categoryService');
const service = new CategoryService();
const router = express.Router();


router.post('/', authMiddleware, (req, res) => {
    let params = req.body;
    let user = req.user;
    service
        .create(user,params)
        .then(data => res.status(200).json(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
});
router.get('/', authMiddleware, (req, res) => {
    let params = req.body;
    
    service
        .list(params)
        .then(data => res.status(200).json(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
});
router.get('/:id', authMiddleware, (req, res) => {
    // let params = req.body;
    let id = req.params.id;
    service
        .show(id)
        .then(data => res.status(200).json(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
});

router.put('/:id', authMiddleware, (req, res) => {
    let params = req.body;
    let id = req.params.id;
    service
        .update(id,params)
        .then(data => res.status(200).json(data))
        .catch(err => {
            res.status(400).send({
                success: false,
                data: [],
                message: err.message
            })
        })
});

router.delete('/:id', authMiddleware, (req, res) => {
    let params = req.body;
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
});

module.exports = router;

