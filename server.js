const http = require('http');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // 메인 페이지를 읽어서 클라이언트에게 전달
    const filePath = path.join(__dirname, 'main.html');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.url === '/subpage.html') {
    if (req.method === 'GET') {
      // 서브페이지를 읽어서 클라이언트에게 전달 (GET 요청)
      const filePath = path.join(__dirname, 'sub.html');
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        }
      });
    } else if (req.method === 'POST') {
      // POST 요청을 처리 (새 게시물을 동적으로 생성)
      let requestBody = '';
      req.on('data', (data) => {
        requestBody += data.toString();
      });

      req.on('end', () => {
        const postData = qs.parse(requestBody);

        // 새 게시물 데이터를 이용하여 동적으로 생성하고 저장 (이 부분을 적절히 처리해야 합니다)

        res.writeHead(302, { Location: '/' });
        res.end();
      });
    }
  } else if (req.url === '/styles.css') {
    // CSS 파일을 읽어서 클라이언트에게 전달
    const filePath = path.join(__dirname, 'styles.css');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(content);
      }
    });
  } else {
    // 정의되지 않은 경로로의 요청에 대한 처리
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});