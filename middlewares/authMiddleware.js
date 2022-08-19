const expressAsyncHandler = require('express-async-handler');

const jwt = require('jsonwebtoken');
const User = require('../model/user/User');

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    let token;
 
    let token_header = req.headers.authorization?.startsWith('Bearer');

    if (!req.headers.authorization) {
        return res.status(408).json({
          success: false,
          message: 'No authorization token',
        });
      }

    if(!token_header) {
        return res.status(408).json({
            success: false,
            message: 'No authorization token',
        });
    }else {
        try {
            token = req.headers.authorization.split(' ')[1];
            if(token) {
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                const user = await User.findById(decoded?.id).select("-password");
                
                req.user = user;
                next();
            }else {
                return res.status(408).json({
                    success: false,
                    message: 'token attached to the headers',
                });
            }
        } catch (error) {
            return res.status(408).json({
                success: false,
                message: 'Vui lòng đăng nhập!',
            });
        }
    }
})


module.exports = authMiddleware;