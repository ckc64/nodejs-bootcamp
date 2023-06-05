const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./module/replaceTemplate');
const slugify = require('slugify');

//--------SERVER------------

const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);

const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const product = productData[query.id];

    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.write(productData);
    res.end();
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>404 Page Not Found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to port 8000 from server');
});

//--------FILE SYSTEM----------
// const textRead = fs.readFileSync('samp.txt', 'utf-8');

// const textAdd = `This is from code`;
// fs.writeFileSync('outputsamp.txt', textAdd);

// console.log(textRead);

// //non blocking
// fs.readFile('samp.txt', 'utf-8', (err, data) => {

// });
