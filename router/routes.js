
/*
* Copyright (c) Nhat Tin 2019. All Rights Reserved.
* @author khoa.nt
*/
module.exports = function (app) {
    const authCtrl  = require('../controllers/users/authControllers');
	app.use(`/auth`, authCtrl);

    const userCtrl = require('../controllers/users/userController');
    app.use(`/user`, userCtrl);

    const postCtrl = require('../controllers/post/postController');
    app.use(`/api/post`, postCtrl);

    const commentCtrl = require('../controllers/comment/commentController');
    app.use(`/api/comment`, commentCtrl);

    const categoryCtrl = require('../controllers/category/categoryController');
    app.use(`/api/category`, categoryCtrl);
};
