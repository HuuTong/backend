const User = require("../../model/user/User");
const { validateUserMongodbId } = require("../../utils/validateMongoDBID");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");

class UserService {
  constructor() {}

  async list(params) {
    try {
      const users = await User.find({});
      return { success: true, data: users, message: "" };
    } catch (error) {
      return { success: false, data: [], message: error.message };
    }
  }

  async delete(id) {
    validateUserMongodbId(id);
    const user = await User.findByIdAndDelete(id);
    return { success: true, data: user, message: "" };
  }

  async show(id) {
    validateUserMongodbId(id);
    const user = await User.findById(id);
    return { success: true, data: user, message: "" };
  }

  async profile(id) {
    validateUserMongodbId(id);
    try {
      const myProfile = await User.findById(id);
      return { success: false, data: myProfile, message: "" };
    } catch (error) {
      return { success: false, data: [], message: error.message };
    }
  }

  async updateProfile(id, params) {
    validateUserMongodbId(id);

    const user = User.findByIdAndUpdate(
      id,
      {
        firstName: params?.firstName,
        lastName: params?.lastName,
        email: params?.email,
        bio: params?.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return user;
  }

  async updatePassword(id, params) {
    validateUserMongodbId(id);

    const user = await User.findById(id);

    if (params.password) {
      user.password = params.password;
      const updateUser = await user.save();
    }

    return {
      success: true,
      data: user,
      message: "Cập nhật mật khẩu thành công!",
    };
  }

  async follow(userId, params) {
    let followId = params?.followId;
    if (!followId) {
      return { success: false, data: [], message: "Không tìm thấy follow ID" };
    }

    const user = await User.findById(userId);
    if (user.following.includes(followId)) {
      return { success: false, data: [], message: "Bạn đã follow user này!" };
    }

    await User.findByIdAndUpdate(
      followId,
      {
        $push: { followers: userId },
        isFollowing: true,
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { following: followId },
        isFollower: true,
      },
      {
        new: true,
      }
    );

    return { success: true, message: "follow thành công!" };
  }

  async unfollow(userId, params) {
    let unfollowId = params?.unfollowId;

    await User.findByIdAndUpdate(
      unfollowId,
      {
        $pull: { followers: userId },
        isFollowing: false,
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: unfollowId },
      },
      {
        new: true,
      }
    );

    return { success: true, message: "unfollow thành công!" };
  }

  async block(id) {
    validateUserMongodbId(id);

    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );

    return { success: true, data: user, message: "Block user thành công!" };
  }

  async unblock(id) {
    validateUserMongodbId(id);

    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );

    return { success: true, data: user, message: "UnBlock user thành công!" };
  }

  async sendMail(email, user_id) {
    const user = await User.findById(user_id);

    const verificationToken = await user.createAccountVerificationToken();
    await user.save();
    console.log("verifoitoken", verificationToken);

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

    const result = `Nếu bạn muốn xác thực tài khoản, cần 10 phút <a href="http://localhost:3000/verify-account/${verificationToken}">Bấm vào đây để xác thực</a>`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Xác thực tài khoản",
      html: result,
    };
    transporter.sendMail(mailOptions, (mailerr, info) => {
      if (mailerr) {
        res.status(400).json("Unable to send email");
      } else {
        return { success: true, data: info, message: "Gửi mail thành công!" };
      }
    });
  }

  async verityAcount(token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const userFound = await User.findOne({
      accountVerificationToken: hashedToken,
      accountVerificationTokenExpires: { $gt: new Date() },
    });

    if (!userFound) throw new Error("Token expired, try again later");

    userFound.isAccountVerified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationTokenExpires = undefined;
    await userFound.save();

    return { success: true, data: userFound, message: "" };
  }

  async uploadPhotoProfile(localPath, _id) {
    const imgUploaded = await cloudinaryUploadImg(localPath);
    const foundUser = await User.findByIdAndUpdate(
      _id,
      {
        profilePhoto: imgUploaded?.url,
      },
      { new: true }
    );

    fs.unlinkSync(localPath);
    return { success: true, data: foundUser, message: 'Cập nhật ảnh đại diện thành công!'};
  }

  handle(promise) {
    return promise
      .then((data) => [data, undefined])
      .catch((error) => Promise.resolve([undefined, error]));
  }
}

module.exports = UserService;
