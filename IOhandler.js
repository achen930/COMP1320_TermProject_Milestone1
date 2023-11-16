/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: November 5th, 2023
 * Author: Annabelle Chen
 *
 */

const { pipeline } = require("stream");

const AdmZip = require("adm-zip"),
  fs = require("fs").promises,
  { createReadStream, createWriteStream } = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

const unzip = (pathIn, pathOut) => {
  const zip = new AdmZip(pathIn);
  zip.extractAllTo(pathOut, true);
}; 

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */

const readDir = (dir) => {
  return fs.readdir(dir, { withFileTypes: true })
  .then((arr) => pngSort(arr))
  .catch((err) => console.log(err));
};

const pngSort = (arr) => {
  const pngFiles = [];
  arr.forEach((file) => {
    if (path.extname(file.name) === ".png") {
      const pngFilePath = path.join(file.path, file.name);
      pngFiles.push(pngFilePath);
    }
  });
  return(pngFiles);
};

/**
 * Description: Read in a PNG file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @param {Array<function>} filters
 * @return {Promise}
 */
const applyFilter = (pathIn, pathOut, filter) => {
  const pathName = path.basename(pathIn);
  pipeline(
    createReadStream(pathIn),
    new PNG()
      .on("parsed", function () {
        this.data = filter(this.height, this.width, this.data)
        this.pack()
      }),
    createWriteStream(path.join(pathOut, pathName)),
    (err) => {
      console.log(err)
    }
  );
};

const grayScale = (height, width, data) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const greyPixels = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

      data[idx] = greyPixels;
      data[idx + 1] = greyPixels;
      data[idx + 2] = greyPixels;
    }
  }
  return data;
};

// Bonus filter
const invertColors = (height, width, data) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      data[idx] = 255 - data[idx];
      data[idx + 1] = 255 - data[idx + 1];
      data[idx + 2] = 255 - data[idx + 2];
    }
  }
  return data;
};

module.exports = {
  unzip,
  readDir,
  applyFilter,
  grayScale,
  invertColors,
};