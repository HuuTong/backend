
const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const router = express.Router();
const PostService = require('../../src/service/postService');
const { postImgResize, profilePhotoUpload } = require("../../utils/profilePhotoUpload");
const service = new PostService();

// get all
router.get('/', authMiddleware, (req, res) => {
    const params = req.query;

    service
        .list(params)
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
});

// togle like
router.put("/likes", authMiddleware, (req, res) => {
    
     const  postId  = req.body.postId;
     const loginUserId = req?.user?._id;
     service
         .likes(postId,loginUserId)
         .then((data) => res.status(200).send(data))
         .catch((err) => res.status(400).send({
             success: false,
             data: [],
             message: err.message
         }))
 });
// togle like
router.put("/dislikes", authMiddleware, (req, res) => {
    
     const  postId  = req.body.postId;
     const loginUserId = req?.user?._id;
     service
         .dislikes(postId,loginUserId)
         .then((data) => res.status(200).send(data))
         .catch((err) => res.status(400).send({
             success: false,
             data: [],
             message: err.message
         }))
 })


// create 
router.post('/', authMiddleware,profilePhotoUpload.single('image'), postImgResize, (req, res) => {
    let params = req.body;
    const {_id} = req.user;
    const  file = req.file.filename;
   
    service
        .create(params, _id, file)
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
})
// detail 
router.get('/:id', authMiddleware, (req, res) => {
    let id = req.params.id;

    service
        .show(id)
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
});

// update 
router.put('/:id', authMiddleware, (req, res) => {
    let id = req.params.id;
    let params = req.body;

    service
        .update(params,id)
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
})
// delete 
router.delete('/:id', authMiddleware, (req, res) => {
    let id = req.params.id;

    service
        .delete(id)
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
})
// update 
router.put('/:id', authMiddleware, (req, res) => {
    let id = req.params.id;
    let params = req.body;

    service
        .update(params,id)
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
});


module.exports = router;