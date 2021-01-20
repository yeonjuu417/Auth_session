const express = require('express');
const cors = require('cors');
const session = require('express-session');
const logger = require('morgan');
const fs = require('fs');
const https = require('https');
const usersRouter = require('./routes/user');
const path = require('path');

const app = express();


// TODO: express-session 라이브러리를 이용해 쿠키 설정을 해줄 수 있습니다.
// 앞서 쿠키 스프린트에서 설정했던 값과 동일하게 설정해도 무방합니다.
app.use(
  session({
    secret: '@codestates',
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: 'localhost',
      path: '/',
      maxAge: 24 * 6 * 60 * 10000,
      sameSite: "none",
      httpOnly: true,
      secure: true,
    },
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: CORS 설정이 필요합니다. 클라이언트가 어떤 origin인지에 따라 달리 설정할 수 있습니다.
// 메서드는 GET, POST, OPTIONS를 허용합니다.
app.use(cors({
  origin: true,
  credentials: true,//인증을 하냐 마냐 (인증할꺼면 true)
  methods : ['GET', 'POST', 'OPTIONS']}
  ));
app.use('/users', usersRouter);

const server = https
  .createServer(
    {
      key: fs.readFileSync(path.join('../../../key/','key.pem') , 'utf-8'),
      cert: fs.readFileSync(path.join('../../../key/','cert.pem') , 'utf-8'),
    },
    app
  )
  .listen(4000);
module.exports = server;
