const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const authMiddleware = require('../../middlewares/authMiddleware');
const User = require('../../model/user/User');
const router = express.Router();
const UserService = require('../../src/service/userService');
const cloudinaryUploadImg = require('../../utils/cloudinary');
const { profilePhotoUpload, profilePhotoResize } = require('../../utils/profilePhotoUpload');
const { validateUserMongodbId } = require('../../utils/validateMongoDBID');
const service = new UserService()


router.get('/', authMiddleware, (req, res) => {
    let params = req.params;

    service
        .list(params)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
})

//delete
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    
    service
        .delete(id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
});

// user following
router.put('/follow', authMiddleware, (req, res) => {
    const userId = req.user.id;
    let params = req.body;
    console.log('okela', params);
    service
        .follow(userId, params)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }));
});

//verity account
router.put('/verity-account/:token', authMiddleware, (req, res) => {
    let token = req.params.token;
    
    service
    .verityAcount(token)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send({
        success: false,
        data: [],
        message: err.message
    }));
})

// send mail

router.post('/generate-verity-email-token', authMiddleware, (req, res) => {
    let { email } = req.body;
    let user_id = req.user.id;
   
    service
     .sendMail(email, user_id) 
     .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }));
})

router.put('/unfollow', authMiddleware, (req, res) => {
    const userId = req.user.id;
    let params = req.body;
    console.log('okela', params);
    service
        .unfollow(userId, params)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }));
});

// block user
router.put('/block-user/:id', authMiddleware, (req, res) => {
    let id = req.params.id;

    service
        .block(id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }));
})


router.put('/unblock-user/:id', authMiddleware, (req, res) => {
    let id = req.params.id;

    service
        .unblock(id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }));
})

//update password
router.put("/password/:id",authMiddleware, (req, res) => {
    let id = req.params.id;
    let params = req.body;

    service
    .updatePassword(id, params)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send({
        success: false,
        data: [],
        message: err.message
    }));
});

//profile
router.get('/profile/:id', authMiddleware, (req, res) => {
    let id = req.params.id;
    
    service
        .profile(id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
});

// upload profile image
router.put("/profilephoto-upload", authMiddleware, profilePhotoUpload.single('image'),profilePhotoResize, (req, res) => {
    console.log('localpath', req.file.filename)
   const localPath = `public/images/profile/${req.file.filename}`;
   const {_id} = req.user;
   // upload cloudinary
   
    service
        .uploadPhotoProfile(localPath,_id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }));
})

// update user 
router.put('/:id', authMiddleware, (req, res) => {
    let id = req.params.id;
    let params = req.body;

    service
        .updateProfile(id, params)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }));
});


//show
router.get('/:id', (req, res) => {
    let id = req.params.id;
    
    service
        .show(id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send({
            success: false,
            data: [],
            message: err.message
        }))
});

// user profile



module.exports = router;