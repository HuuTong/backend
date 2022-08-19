const Post = require("../../model/post/Post");
const { validateUserMongodbId } = require("../../utils/validateMongoDBID");
const Filter = require("bad-words");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");

class PostService {
  constructor() {}

  // likes taggle
  async likes(postId, loginUserId) {
    validateUserMongodbId(postId);
    const post = await Post.findById(postId);
    const isLiked = post?.isLiked;
    const alreadyDisLiked = post?.disLikes?.find(
      (userId) => userId?.toString() == loginUserId?.toString()
    );

    if (alreadyDisLiked) {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { disLikes: loginUserId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
      return { success: true, data: post, message: "" };
    }
    if (isLiked) {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      return { success: true, data: post, message: "" };
    } else {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        {
          new: true,
        }
      );
      return { success: true, data: post, message: "" };
    }
  }

  // toggle dislike
  async dislikes(postId, loginUserId) {
    validateUserMongodbId(postId);
    const post = await Post.findById(postId);

    const isDisLiked = post?.isDisLiked;
    const alreadyLiked = post?.likes?.find(
      (userId) => userId.toString() == loginUserId.toString()
    );
    if (alreadyLiked) {
      const post = await Post.findOneAndUpdate(
        postId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
    }

    if (isDisLiked) {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { disLikes: loginUserId },
          isDisLiked: true,
        },
        {
          new: true,
        }
      );

      return { success: true, data: post, message: "" };
    } else {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { disLikes: loginUserId },
          isDisLiked: true,
        },
        {
          new: true,
        }
      );
      return { success: true, data: post, message: "" };
    }
  }

  //create
  async create(params, _id, file) {
    await validateUserMongodbId(_id);
    const filter = new Filter();
    const isProfane = filter.isProfane(params.title, params.description);

    if (isProfane) {
      const user = await User.findByIdAndUpdate(_id, {
        isBlocked: true,
      });
      throw new Error("Tạo bài viết k thành công, vì có từ nhạy cảm");
    }
    try {
      const imgUpload = await cloudinaryUploadImg(
        `public/images/posts/${file}`
      );
      params.image = imgUpload?.url;
      const post = await Post.create(params);
      fs.unlinkSync(`public/images/posts/${file}`);
      return { success: true, data: post, message: "Tạo bài viết thành công" };
    } catch (error) {
      return { success: false, data: [], message: error.message };
    }
  }

  // list
  async list(params) {
    const posts = await Post.find({}).populate("user");
    console.log("123", posts);

    return { success: true, data: posts, message: "" };
  }

  // detail
  async show(id) {
    validateUserMongodbId(id);
    const post = await Post.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes");
    post.numViews += 1;
    await post.save();
    return { success: true, data: post, message: "" };
  }

  async update(params, id) {
    validateUserMongodbId(id);
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...params,
      },
      {
        new: true,
      }
    );

    return {
      success: true,
      data: post,
      message: "Cập nhật bài viết thành công.",
    };
  }

  async delete(id) {
    validateUserMongodbId(id);
    const post = await Post.findByIdAndDelete(id);

    return { success: true, message: "Xóa thành công." };
  }

  handle(promise) {
    return promise
      .then((data) => [data, undefined])
      .catch((error) => Promise.resolve([undefined, error]));
  }
}

module.exports = PostService;
