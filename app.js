const express = require("express");
const cors = require("cors");
const path = require("path");

// 创建并开启服务器
const app = express();
app.listen(3007, () => console.log("大事件服务器开启了"));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
// 开放静态资源
//uploads 文件夹放前端页面上传的图片 如头像
app.use(express.static(path.join(__dirname, "./uploads")));

// 配置路由
app.use("/api", require(path.join(__dirnameq, "./routers/login")));
app.use("/my", require(path.join(__dirname, "./routers/user.js")));
app.use("/my", require(path.join(__dirname, "./routers/category.js")));
app.use("/my", require(path.join(__dirname, "./routers/article.js")));
