const Comment = require("../../model/comment/Comment");
const { validateUserMongodbId } = require("../../utils/validateMongoDBID");

class CommentService {
  constructor() {}


  async create(user, params) {
    try {
       
        const commnet = await Comment.create({
            postId: params.postId,
            description: params.description,
            user
        });

        return { success: true, data: commnet, message: "Commnet thành công." };        
    }catch(err) {
        return { success: false, data: [], message: err.message };        
    }
  }

  async list(params) {
    try {
        const commnets = await Comment.find({}).sort("-created");
        return {success: true, data: commnets, message:""};
    } catch (err) {
        return { success: false, data: [], message: err.message};
    }
  }

  async show(id, params) {
    try {
        const comment = await Comment.find({id});
        return {success: true, data: comment, message: ""};
    } catch (err) {
        return { success: false, data: [], message: err.message };
    }
  }

  async update(id, params) {
    try {
        const commnet = await Comment.find({id});
        if(!commnet) {
            return {success: false, data: [], message: "Not found"};
        }
        const updateComment = await Comment.findByIdAndUpdate(id,{
           postId: params?.postId,
           description: params.description
        }, {
            new: true,
            runValidators: true,
        });

        return {success: true, data: updateComment, message: "Update thành công."};
    } catch (err) {
        return { success: false, data: [], message: err.message };
    }
  }

  async del(id) {
    try {
        validateUserMongodbId(id)
        await Comment.findByIdAndDelete(id);
        return { success: true, data: [], message: "Xóa thành công."};
    } catch (err) {
        return { success: false, data: [], message: err.message };
    }
  }

  handle(promise) {
    return promise
      .then((data) => [data, undefined])
      .catch((error) => Promise.resolve([undefined, error]));
  }
}

module.exports = CommentService;
