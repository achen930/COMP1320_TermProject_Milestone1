const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date: November 5th, 2023
 * Author: Annabelle Chen
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const grayScalePathProcessed = path.join(__dirname, "grayscaled");
const invertedPathProcessed = path.join(__dirname, "inverted");

IOhandler.unzip(zipFilePath, pathUnzipped);
console.log("Extraction operation complete");

IOhandler.readDir(pathUnzipped)
.then((imgs) => {
    // better solution: worker threads
    Promise.all([
        IOhandler.applyFilter(imgs[0], grayScalePathProcessed, IOhandler.grayScale),
        IOhandler.applyFilter(imgs[1], grayScalePathProcessed, IOhandler.grayScale),
        IOhandler.applyFilter(imgs[2], grayScalePathProcessed, IOhandler.grayScale),
    ]);
})
.then(() => console.log("All images grayscaled!"))
.then(() => IOhandler.readDir(pathUnzipped))
.then((imgs) => {
    Promise.all([ // requires existing folder named "inverted"
        IOhandler.applyFilter(imgs[0], invertedPathProcessed, IOhandler.invertColors),
        IOhandler.applyFilter(imgs[1], invertedPathProcessed, IOhandler.invertColors),
        IOhandler.applyFilter(imgs[2], invertedPathProcessed, IOhandler.invertColors),
    ]);
})
.then(() => console.log("All images inverted!"))
.catch((err) => console.log(err));