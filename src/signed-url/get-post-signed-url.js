var AWS = require("aws-sdk");
var credentials = {
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   secretAccessKey: process.env.S3_SECRET_KEY,
  accessKeyId: process.env.AC_KEY,
  secretAccessKey: process.env.SECRET_KEY,
};
AWS.config.update({
  credentials: credentials,
  region: process.env.S3_REGION,
});

var s3 = new AWS.S3({ signatureVersion: "v4" });

const params = {
  Bucket: process.env.S3_BUCKET,
  Expires: 10000000, //time to expire in seconds

  Fields: {
    key: "test",
  },
  conditions: [
    { acl: "private" },
    { success_action_status: "201" },
    ["starts-with", "$key", ""][("content-length-range", 0, 100000)],
    { "x-amz-algorithm": "AWS4-HMAC-SHA256" },
  ],
};

var presignedPUTURL = s3.getSignedUrl("putObject", {
  Bucket: "tony-work-demo",
  //   Key: "user12/image.jpg", //filename
  Key: "image.jpg", //filename
  //   Expires: 100, //time to expire in seconds
  Expires: 86400, //time to expire in seconds
});

exports.generatePresignedURL = function (req, res) {
  params.Fields.key = req.query.filename || "filename";

  s3.createPresignedPost(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(500).json({
        msg: "Error",
        Error: "Error creating presigned URL",
      });
    } else {
      let buildParam = {
        signature: {
          "Content-Type": "",
          acl: "public-read-write",
        //   acl: process.env.S3_ACL,
        //   success_action_status: "201",
          policy: data.fields.Policy,
          "X-amz-credential": data.fields["X-Amz-Credential"],
          "X-amz-algorithm": data.fields["X-Amz-Algorithm"],
          "X-amz-date": data.fields["X-Amz-Date"],
          "X-amz-signature": data.fields["X-Amz-Signature"],
          key: data.fields.key,
        },
        postEndpoint: data.url,
      };

      console.log("buildParam: ", buildParam);

    //   res.status(200).json(data);
      res.status(200).json(buildParam);
      
    }
  });

  //put
  //   s3.getSignedUrl(
  //     "putObject",
  //     {
  //       Bucket: "tony-work-demo",
  //     //   Key: "IMG_0796.jpeg", //filename
  //       Key: "image.jpg", //filename
  //       Expires: 86400, //time to expire in seconds
  //       ContentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  //     },
  //     function (err, data) {
  //       if (err) {
  //         console.log("Error", err);
  //         res.status(500).json({
  //           msg: "Error",
  //           Error: "Error creating presigned URL",
  //         });
  //       } else {
  //         res.status(200).json(data);
  //       }
  //     }
  //   );
};
