const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const auth = require("../../middlewares/auth");
//---------------------------------------------------------------------

const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: "https://blr1.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const myBucket = process.env.AWS_BUCKET_NAME;
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: myBucket,
    acl: "public-read",
    key: function (request, file, cb) {
      cb(null, file.originalname);
    },
    limits: {
      fileSize: 1024 * 1024 * 250, // 250MB
    },
  }),
}).array("upload", 5);

const imageUpload = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send({
        message: "No file uploaded",
        data: {},
      });
    }

    const links = req.files.map((file) => {
      if (
        file.location.startsWith("http://") ||
        file.location.startsWith("https://")
      ) {
        return file.location;
      } else {
        return "https://" + file.location;
      }
    });

    return res.send({
      status: true,
      message: "Files uploaded successfully",
      data: {
        link: links || "",
      },
    });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Files upload failed",
      data: null,
    });
  }
};

router.post("/upload", auth(), upload, imageUpload);

module.exports = router;
