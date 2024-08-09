const axios = require("axios");

exports.getLinkedInAccessToken = async (code) => {
  const tokenResponse = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    null,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        grant_type: "authorization_code",
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        code,
      },
    }
  );

  return tokenResponse.data.access_token;
};

exports.getLinkedInUserInfo = async (access_token) => {
  const userInfoResponse = await axios.get(
    "https://api.linkedin.com/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "LinkedIn-Version": "202311",
      },
    }
  );

  return userInfoResponse.data;
};
