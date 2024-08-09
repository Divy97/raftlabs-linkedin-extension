const express = require("express");
const {
  createLinkedInPost,
  getPosts,
} = require("../controllers/postController");

const router = express.Router();

router.post("/post-to-linkedin", createLinkedInPost);
router.post("/get-posts", getPosts);

module.exports = router;
