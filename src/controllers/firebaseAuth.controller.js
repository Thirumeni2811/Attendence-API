/* eslint-disable camelcase */
const httpStatus = require("http-status");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const {
  verifyIdToken,
  findOrCreateUser,
  generateAppleClientSecret,
  verifyAppleIdToken,
  findOrCreateAppleUser,
} = require("../services/firebaseAuth.service");
const { tokenService } = require("../services");

const googleLogin = catchAsync(async (req, res) => {
  // console.log("req.headers----->", req.headers);
  const idToken = req.headers.authorization;

  // console.log("idToken--->", idToken);

  if (!idToken) {
    return res.status(httpStatus.UNAUTHORIZED).send("Unauthorized");
  }

  const decodedToken = await verifyIdToken(idToken);
  // console.log("decodedToken--->", decodedToken);

  const { sub: uid, name, email, picture, email_verified } = decodedToken;

  const user = await findOrCreateUser(
    uid,
    name,
    email,
    picture,
    email_verified
  );
  const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user, tokens });
});

// ==========================================================================
const appleLogin = catchAsync(async (req, res) => {
  const idToken = req.body.idToken || req.headers.authorization;
  const { appleCode } = req.body;

  if (!idToken && !appleCode) {
    return res.status(httpStatus.UNAUTHORIZED).send("Unauthorized");
  }

  let decodedToken;
  if (idToken) {
    // Verify the Apple ID token
    decodedToken = await verifyAppleIdToken(idToken);
  } else if (appleCode) {
    // Generate the client secret and exchange authorization code for tokens
    const clientSecret = generateAppleClientSecret();

    const tokenResponse = await axios({
      method: "post",
      url: "https://appleid.apple.com/auth/token",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "authorization_code",
        code: appleCode,
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
      }),
    });

    const { id_token } = tokenResponse.data;
    decodedToken = await verifyAppleIdToken(id_token);
  }

  const { sub: appleUserId, email, name, email_verified } = decodedToken;

  // Find or create the user
  const user = await findOrCreateAppleUser(
    appleUserId,
    email,
    name,
    email_verified
  );

  // Generate tokens for the user
  const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user, tokens });
});
// ==========================================================================
module.exports = {
  googleLogin,
  appleLogin,
};

/* eslint-disable camelcase */
