const express = require("express");
const router = express.Router();
const db = require("../db");

// 加载jsonwebtoken模块（用于生成token加密串）
const jwt = require("jsonwebtoken");
// 加载加密模块
const utility = require("utility");

// 登录接口
router.post("/login", async (req, res) => {
  //因为注册时的密码是加密的，所以在登录验证密码时，需要都为加密格式才能进行比较
  let r = await db("select * from user where username=? and password=?", [
    req.body.username,
    utility.md5(req.body.password),
  ]);
  // console.log(r);
  // console.log(r[0].username);
  // 判断是否能查询到数组，
  if (r && r.length > 0) {
    // 用户名和密码正确，登录成功
    res.json({
      status: 0,
      message: "登录成功！",
      // 服务器生成token，返还给浏览器
      token:
        "Bearer " +
        jwt.sign({ username: r[0].username, id: r[0].id }, "bigevent-9760", {
          expiresIn: 200000,
        }),
    });
  } else {
    res.json({
      status: 1,
      message: "登录失败！",
    });
  }
});

// 注册
router.post("/reguser", async (req, res) => {
  //   使用 utility.md5(req.body.password) 对密码进行加密
  req.body.password = utility.md5(req.body.password);
  let r = await db("insert into user set ?", req.body);
  //   console.log(r);//是一个对象
  // 凡是对数据库增删改，都会返回一个对象

  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "注册成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "注册失败！",
    });
  }
});

module.exports = router;
