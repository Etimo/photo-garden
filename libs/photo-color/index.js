const jpeg = require('jpeg-js');

const getAverageFromBase64 = (base64String) => {
  return getAverageFromBuffer(Buffer.from(base64String, 'base64'));
}

const getAverageFromBuffer = (imagebuffer) => {
  const buffer = jpeg.decode(imagebuffer);
  let i = 0;
  let count = 0;

  const rgb = {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  }

  while (i < buffer.data.length) {
    count++;
    rgb.r += buffer.data[i++];
    rgb.g += buffer.data[i++];
    rgb.b += buffer.data[i++];
    rgb.a += buffer.data[i++];
  }

  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);
  rgb.a = ~~(rgb.a / count);

  return rgb;
}

module.exports = {
  getAverageFromBase64,
  getAverageFromBuffer
};