const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  linkedinPostId: { type: String, required: true },
  linkedinUserSub: { type: String, required: true },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
