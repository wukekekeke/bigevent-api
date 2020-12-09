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

// 登录认证
// 使用express-jwt模块，控制 以 /my 开头的接口，需要正确的token才能访问
const expressJWT = require("express-jwt");
/* 
secret : 加密秘钥，加密和解密的秘钥必须要一致
algorithms ： 加密算法 ['HS256']，默认，不用改
path 取值范围：unless({path: 排除不需要验证的}))
*/
app.use(
  expressJWT({ secret: "bigevent-9760", algorithms: ["HS256"] }).unless({
    path: /^\/api/,
  })
);

// 配置路由
app.use("/api", require(path.join(__dirname, "routers", "login")));
app.use("/my", require(path.join(__dirname, "routers", "user")));
app.use("/my/article", require(path.join(__dirname, "routers", "category")));
app.use("/my/article", require(path.join(__dirname, "routers", "article")));

// 错误配置，统一处理token的问题
app.use((err, req, res, next) => {
  // 真的token问题，做判断
  if (err.name === "UnauthorizedError") {
    console.log(err.message);
    res.json({
      status: 1,
      message: "身份认证失败！",
    });
  }
});
