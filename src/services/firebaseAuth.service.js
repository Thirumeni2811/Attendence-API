/* eslint-disable */

const { User } = require("../models");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const jwkToPem = require("jwk-to-pem");

// const verifyIdToken = async (idToken) => {
//   console.log("idToken===>", idToken);
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     console.log("decodedToekn---->", decodedToken);
//     console.log("Audience (aud) claim:", decodedToken.aud);
//     return decodedToken;
//   } catch (error) {
//     console.error("Error verifying ID token:", error);
//     throw new Error("Unauthorized");
//   }
// };

const verifyIdToken = async (idToken) => {
  try {
    // Decode the token without verification
    const decodedToken = jwt.decode(idToken, { complete: true });

    if (!decodedToken) {
      throw new Error("Invalid ID token");
    }

    // Extract the payload (where the `aud` claim is)
    const payload = decodedToken.payload;

    // Define your Firebase Project ID and Client ID
    const PROJECT_ID = process.env.PROJECT_ID; // Replace with your actual Firebase Project ID
    // const PROJECT_ID = "sample-getin"; // Replace with your actual Firebase Project ID
    const CLIENT_ID = process.env.CLIENT_ID; // Replace with your actual client ID

    // Manually check the audience (aud) claim
    if (payload.aud !== PROJECT_ID && payload.aud !== CLIENT_ID) {
      console.error(
        "Audience (aud) claim does not match. Expected:",
        PROJECT_ID,
        "or",
        CLIENT_ID,
        "but got:",
        payload.aud
      );
      throw new Error("Unauthorized");
    }

    // Fetch Google's public keys to verify the token signature
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/certs"
    );
    const publicKeys = response.data;

    // Get the appropriate public key for verifying the signature
    const publicKey = publicKeys[decodedToken.header.kid];
    if (!publicKey) {
      throw new Error("Invalid token signature");
    }

    // Verify the token's signature using the public key
    const verifiedToken = jwt.verify(idToken, publicKey, {
      algorithms: ["RS256"],
    });

    return verifiedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error.message);
    throw new Error("Unauthorized");
  }
};

const findOrCreateUser = async (uid, name, email, picture, email_verified) => {
  if (!uid || !email) {
    throw new Error("Invalid user data: UID and email are required");
  }
  let user;
  try {
    // Check for existing user by email
    user = await User.findOne({ email });

    if (!user) {
      // Create a new user if no user found with the same email
      user = new User({
        uid,
        name,
        email,
        userName: `${uid}-${name}`,
        profilePicture: picture,
        isEmailVerified: email_verified,
      });
    } else {
      // Update user details if user with the same email already exists
      user.uid = uid;
      // user.name = name;
      // user.profilePicture = picture;
      user.isEmailVerified = email_verified;
    }

    await user.save();
  } catch (error) {
    throw new Error("Error saving user: ", error.message);
  }
  return user;
};

//------------------------------------------------------------------
// Function to generate the Apple client secret
const generateAppleClientSecret = () => {
  const claims = {
    iss: process.env.APPLE_TEAM_ID, // Team ID
    iat: Math.floor(Date.now() / 1000), // Issued at current time
    exp: Math.floor(Date.now() / 1000) + 15777000, // Expires in 6 months
    aud: "https://appleid.apple.com",
    sub: process.env.APPLE_CLIENT_ID, // Client ID
  };

  // Replace and properly format the private key
  const privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n");

  // Generate the JWT token with ES256 algorithm
  const token = jwt.sign(claims, privateKey, {
    algorithm: "ES256",
    keyid: process.env.APPLE_KEY_ID,
  });

  return token;
};

// Function to verify the Apple ID token
const verifyAppleIdToken = async (idToken) => {
  try {
    const response = await axios.get("https://appleid.apple.com/auth/keys");
    const appleKeys = response.data.keys;

    // Get the key used for signing the ID token
    const header = jwt.decode(idToken, { complete: true }).header;
    const key = appleKeys.find((key) => key.kid === header.kid);

    if (!key) {
      throw new Error("Invalid key ID");
    }

    // Convert the JWK to PEM format
    const pubKey = jwkToPem(key);
    const decoded = jwt.verify(idToken, pubKey, { algorithms: ["RS256"] });

    return decoded;
  } catch (error) {
    console.error("Error verifying Apple ID token:", error.message);
    throw new Error("Unauthorized");
  }
};

// Function to handle user registration or login
const findOrCreateAppleUser = async (
  appleUserId,
  email,
  name,
  email_verified
) => {
  if (!appleUserId || !email) {
    throw new Error("Invalid user data: Apple User ID and email are required");
  }

  let user = await User.findOne({ email });

  if (!user) {
    // Create a new user if not found
    user = new User({
      uid: appleUserId,
      email,
      name: name ? `${name.firstName} ${name.lastName}` : null,
      userName: `${appleUserId}-${email.split("@")[0]}`,
      isEmailVerified: email_verified,
    });
  } else {
    // Update user details if found
    user.uid = appleUserId;
    user.isEmailVerified = email_verified;
  }

  await user.save();
  return user;
};
//------------------------------------------------------------------

module.exports = {
  verifyIdToken,
  findOrCreateUser,
  generateAppleClientSecret,
  verifyAppleIdToken,
  findOrCreateAppleUser,
};

/* eslint-disable */
