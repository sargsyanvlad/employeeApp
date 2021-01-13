const imageDownloader = require('image-downloader');

exports.download = async (uri, name) => {
  try {
    const options = {
      url: uri,
      dest: `${__dirname}/temp/${name || 'profile'}.png`.replace('utils/', ''),
    };
    const { filename } = await imageDownloader.image(options);
    return { path: filename, name };
  } catch (err) {
    console.log('download Error', err);
    throw err;
  }
};
