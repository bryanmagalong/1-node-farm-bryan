// import fs (file system) module
const fs = require('fs');

// Read a file
// First param: file path
// 2nd param: encoding
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

const textOut = `This is what we know about the avocado: ${textIn}\nCreated on ${Date.now()}`;
console.log(textOut);
