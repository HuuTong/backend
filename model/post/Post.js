const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Tiêu đề bài viết là bắt buộc"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Danh mục bài viết là bắt buộc"],
        default: "All"
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisLiked: {
        type: Boolean,
        default: false,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    disLikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please Author is required']
    },
    description: {
        type: String,
        required: [true, 'Vui lòng nhập miêu tả']
    },
    image: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2022/06/22/10/47/cheetah-7277665_960_720.jpg'
    }

}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;