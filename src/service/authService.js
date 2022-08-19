const generateToken = require("../../config/token/generateToken");
const User = require("../../model/user/User");
const nodemailer = require('nodemailer');
const crypto = require('crypto')

class AuthService {
  constructor() {}

  async register(params) {
    const userExists = await User.findOne({ email: params?.email });
    if (userExists) throw new Error("Email đã tồn tại trong hệ thống.");
    try {
      const user = await User.create({
        firstName: params?.firstName,
        lastName: params?.lastName,
        email: params?.email,
        password: params?.password,
      });
      return { success: true, data: user, message: "Tạo user thành công" };
    } catch (error) {
      return { success: false, data: [], message: error.message };
    }
  }

  async login(params) {
    // check user exists
    const user = await User.findOne({ email: params?.email });

    if (!user) {
      return {
        success: false,
        data: [],
        message: "Tài khoản không tồn tại trong hệ thống!",
      };
    }
    if (user && (await user.isPasswordMatched(params?.password))) {
      let token = generateToken(user?._id);
      let data = {
        _id: user?._id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        profilePhoto: user?.profilePhoto,
        isAdmin: user?.isAdmin,
        token: token,
      };
      console.log("token", data.token);
      return { success: true, data: data, message: "" };
    } else {
      return { success: false, data: [], message: "Sai mật khẩu" };
    }
  }

  async forgetPassword(params) {
    if (!params.email) {
      return {
        success: false,
        data: [],
        message: "Vui lòng nhập email để lấy lại mật khẩu!",
      };
    }

    const user = await User.findOne({ email: params.email });
    if (!user) throw new Error("Không tìm thấy user!");

    try {
      const token = await user.createPasswordResetToken();
      console.log("token", token);
      await user.save();

      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, //ssl
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      const result = `Bạn muốn reset mật khẩu: thời gian tối đa để đặt lại mật khẩu là 10 phút <a href="http://localhost:3000/reset-password/${token}">Bấm vào đây để reset</a>`;
      const mailOptions = {
        from: process.env.EMAIL,
        to: params.email,
        subject: "RESET PASSWORD",
        html: result,
      };
      transporter.sendMail(mailOptions, (mailerr, info) => {
        if (mailerr) {
          res.status(400).json("Unable to send email");
        } else {
          res.json('123')
        }
      });
      return { success: true, message: 'Vui lòng check mail để đặt lại mật khẩu'}
    } catch (error) {}
  }

  async resetPassword(params, token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if(!user) throw new Error("Token expired, try again later!");

    user.password = params.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();

    return { success: true, data: user, message: "Reset mật khẩu thành công!"}
  }

  handle(promise) {
    return promise
      .then((data) => [data, undefined])
      .catch((error) => Promise.resolve(undefined, error));
  }
}

module.exports = AuthService;
