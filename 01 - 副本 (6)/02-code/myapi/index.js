const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 处理参数
app.use(bodyParser.urlencoded({ extended: false })) // 处理表单形式的参数：application/x-www-form-urlencoded
app.use(bodyParser.json()) // 处理json形式的参数： application/json
// {uname:"lisi",pwd:"123"}

// 启动静态资源服务
app.use(express.static('public'));

app.get('/data', (req, res) => {
  // res.send('hello');
  let param = req.query;
  res.json({
    uname: param.uname,
    pwd: param.pwd
  });
})

app.listen(3000, () => {
  console.log('running...')
})