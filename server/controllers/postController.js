const axios = require("axios");
const User = require("../models/User");
const Post = require("../models/Post");

exports.createLinkedInPost = async (req, res) => {
  const { token, text, author } = req.body;

  if (!token || !text || !author) {
    return res
      .status(400)
      .json({ error: "Token, text, and author are required" });
  }

  try {
    const postData = {
      author: `urn:li:person:${author}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    const user = await User.findOne({ linkedinId: author });

    const newPost = new Post({
      userId: user._id,
      linkedinPostId: response.data.id,
      linkedinUserSub: user.linkedinId,
    });

    await newPost.save();

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error posting to LinkedIn:", error.message);
    res.status(500).json({ error: "Failed to post to LinkedIn" });
  }
};

exports.getPosts = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const userPosts = await Post.find({ linkedinUserSub: userId });
    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
