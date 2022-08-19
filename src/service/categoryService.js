const Category = require("../../model/category/Category");
const Comment = require("../../model/comment/Comment");
const { validateUserMongodbId } = require("../../utils/validateMongoDBID");

class CategoryService {
    constructor() {

    }

    async create(user, params) {
        try {
            const category = await Category.create({
                user: user._id,
                title: params.title
            });
            return { success: true, data: category, message: "Create category thành công." }
        } catch (err) {
            return { success: false,data: [], message: err.message};
        }
    }

    async list(params) {
        try {
            const category = await Category.find({});
            return { success: true, data: category, message: "" }
        } catch (err) {
            return { success: false,data: [], message: err.message};
        }
    }

    async show(id) {
        try {
            validateUserMongodbId(id);
            const category = await Category.find({id});
            return { success: true, data: category, message: "" }
        } catch (err) {
            return { success: false,data: [], message: err.message};
        }
    }

    async update(id, params) {
        try {
            validateUserMongodbId(id);
            const category = await Category.findByIdAndUpdate(id, {
                title: params.title
            }, {
                new: true
            });
            return { success: true, data: category, message: "Cập nhật thành công." }
        } catch (err) {
            return { success: false,data: [], message: err.message};
        }
    }

    async del(id) {
        try {
            validateUserMongodbId(id);
            const category = await Category.findByIdAndDelete(id);
            return { success: true, message: "Xóa thành công." }
        } catch (err) {
            return { success: false,data: [], message: err.message};
        }
    }

    
}

module.exports = CategoryService;