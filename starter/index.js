const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//========= FILE
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
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   // error handling
//   if(err) return console.log('ERROR!');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     // this console.log will show the data once the file is fully read
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       // Asynchronous Write data, no need of the data param in the callback since
//       // we don't read any
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your file has been written !')
//       });
//     });
//   });
// });
// console.log('Will read file')
//=========

//========= SERVER
/**
 * Each time we hit the server, the callback function will be called
 * In this callback, we have access to the Request and Response object
 */

// We read the data once, only in the beginning
// and each time we hit the api route, we send it back
// __dirname -> where the current file is located

//== html templates
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Array of slugs
const slugs = dataObj.map((elem) => slugify(elem.productName, { lower: true }));
console.log('//======== SLUGS ARRAY: ', slugs);

const server = http.createServer((req, res) => {
  //== ROUTING
  // get query and pathname variables from Url object by destructuring
  // query contains the url parameters such as id
  const { query, pathname } = url.parse(req.url, true);

  // if the url is the root or overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    // Replace all placceholders for each card in dataObj
    // and join all the elements of the new array in a string
    const cardsHtml = dataObj
      .map((elem) => replaceTemplate(templateCard, elem))
      .join('');

    // Replace the PRODUCT_CARDS placeholder with our html
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  } else if (pathname === '/product') {
    // if the url is product
    res.writeHead(200, { 'Content-type': 'text/html' });
    // Get the product from database by the url parameter id
    const product = dataObj.find((item) => item.id == query.id);
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    // error 404

    // send an http header
    // we specify that the content that we're sending is html
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>PAGE NOT FOUND</h1>');
  }
  //===========
});

// Specify which port the server will listen
// 1rst param: port
// 2nd param: host (default is localhost -> 127.0.0.1) opt
// callback opt
server.listen(8001, '127.0.0.1', () => {
  console.log('Listening to request on port 8001');
});
