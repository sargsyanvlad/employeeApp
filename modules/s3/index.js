const { InternalServerError } = require('../exceptions');
const { awsConfig } = require('../../config');
const shortId = require('short-id');
const AWS = require('aws-sdk/index');
const fs = require('fs');

const s3bucket = new AWS.S3(awsConfig.s3);


AWS.config.setPromisesDependency(Promise);

class S3 {
  static async getSignedUrl(queryParams) {
    try {
      const id = shortId.generate();
      const ext = queryParams.ext || '';

      const fileName = `${awsConfig.s3.BucketFolder}/${id}-${(new Date()).getTime()}${ext}`;

      const params = {
        ACL: 'public-read',
        Bucket: awsConfig.s3.Bucket,
        Key: fileName,
        ContentType: 'application/octet-stream',
      };
      const url = await s3bucket.getSignedUrl('putObject', params);
      return {
        url,
        fileName,
      };
    } catch (ex) {
      throw new InternalServerError();
    }
  }

  static async upload(file) {
    const id = shortId.generate();

    const fileName = `${awsConfig.s3.BucketFolder}/${id}-${(new Date()).getTime()}.png`;

    return new Promise((resolve, reject) => {
      s3bucket.upload({
        Key: fileName,
        Bucket: awsConfig.s3.Bucket,
        ACL: 'public-read',
        Body: fs.createReadStream(file.path),
      }, (err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  }
}

module.exports = S3;
