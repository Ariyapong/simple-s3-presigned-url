// function decrypt(buffer) {
//     const kms = new aws.KMS({
//         accessKeyId: 'AKCVBTRNOSMLTIB7ROQQ',
//         secretAccessKey: 'lJQtdIfH/Cup9AyabHV9h2NnR/eKFIsZea2Vn0k',
//         region: 'ap-southeast-1'
//     });
//     return new Promise((resolve, reject) => {
//         const params = {
//             CiphertextBlob: buffer// The data to dencrypt.
//         };
//         kms.decrypt(params, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data.Plaintext);
//             }
//         });
//     });
// }

exports.greeting = function (req, res) {
  res.json({ greeting: "hello world!", envTest: process.env.AWS_ACCESS_KEY_ID });
};
