const User = require("../models/User");
const {
  getLinkedInAccessToken,
  getLinkedInUserInfo,
} = require("../utils/linkedinApi");

exports.getLinkedInAccessToken = async (req, res) => {
  const { code } = req.body;

  console.log(code);

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const access_token = await getLinkedInAccessToken(code);
    const userInfo = await getLinkedInUserInfo(access_token);

    console.log(access_token, userInfo);

    let user = await User.findOne({ linkedinId: userInfo.sub });

    if (!user) {
      user = new User({
        linkedinId: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        accessToken: access_token,
      });
      await user.save();
    }

    res.send({ ...userInfo, access_token });
  } catch (error) {
    console.error(
      "Error fetching LinkedIn access token or user info:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Failed to get access token or user details" });
  }
};
