const http = require('http');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');

const DATA_FILE = 'data.json';

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  if (method === 'GET') {
    if (url === '/' || url === '/index.html') {
      const filePath = path.join(__dirname, 'index.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else if (url === '/style.css') {
      const filePath = path.join(__dirname, 'style.css');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/css' });
          res.end(data);
        }
      });
    } else if (url === '/data') {
      // JSON 데이터 파일에서 게시물 데이터를 불러오기
      fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        }
      });
    } else {
      // 다른 정적 파일 서비스 (CSS, 이미지 등) 추가
    }
  } else if (method === 'POST' && url === '/submit') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const postData = qs.parse(body);

      // JSON 데이터 파일에서 게시물 데이터 불러오기
      fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          const jsonData = JSON.parse(data);

          // 새 게시물 데이터 추가
          jsonData.push(postData);

          // JSON 데이터 파일에 쓰기
          fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            } else {
              // 새 게시물을 생성하고 메인 페이지로 리디렉션
              res.writeHead(302, { Location: '/' });
              res.end();
            }
          });
        }
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});