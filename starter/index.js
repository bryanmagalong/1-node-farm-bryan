// import fs (file system) module
const fs = require('fs');

//== Read/Write datas in synchronous way
/*
 * Read a file (synchronous)
 * First param: file path
 * 2nd param: encoding
*/ 
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// const textOut = `This is what we know about the avocado: ${textIn}\nCreated on ${Date.now()}`;
/* 
 * Write a file (synchronous)
 * First param: File path
 * 2nd param, string to write
*/
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written !');

//== Read/Write datas in asynchronous way
/*
 * 3rd param: callback
 * the file will be read in the background without blocking the thread
*/

//! Callback hell
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    // this console.log will show the data once the file is fully read
    console.log(data2);
    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
      console.log(data3);

      // Asynchronous Write data, no need of the data param in the callback since
      // we don't read any
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
        console.log('Your file has been written !')
      });
    });
  });
});
console.log('Will read file')