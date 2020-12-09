const express = require("express");
const router = express.Router();
const db = require("../db");
const utility = require("utility");

router.get("/userinfo", async (req, res) => {
  // res.send("测试，需要token数据才能访问");
  //通过req.user拿到加密token时存的值
  let r = await db("select * from user where username=?", req.user.username);
  // console.log(req.user);
  // console.log(r);
  // r会返回查询的数组
  if (r && r.length > 0) {
    res.json({
      status: 0,
      message: "获取用户基本信息成功！",
      data: r[0],
    });
  } else {
    res.json({
      status: 1,
      message: "获取用户基本信息失败！",
    });
  }
});

// 更新用户信息
router.post("/userinfo", async (req, res) => {
  let obj = {
    nickname: req.body.nickname,
    email: req.body.email,
  };
  let r = await db("update user set ? where id=?", [obj, req.body.id]);
  console.log(r);
  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "修改用户信息成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "修改用户信息失败！",
    });
  }
});

//更新密码
router.post("/updatepwd", async (req, res) => {
  // 1 先需要判断两次的密码是否一致
  if (req.body.oldPwd === req.body.newPwd) {
    return res.json({
      status: 1,
      message: "新密码和原密码不能相同",
    });
  }
  // 2 再验证原密码是否正确
  // 因为数据库中的密码已经被加密，所以用旧密码查找也需要加密
  let p = await db("select * from user where username=? and password=?", [
    req.user.username,
    utility.md5(req.body.oldPwd),
  ]);
  // if(p&&p.length>0)
  // 这是查到了对应信息，反过来，先写没查到信息
  if (p === undefined || p.length === 0) {
    return res.json({
      status: 1,
      message: "原密码错误",
    });
  } else {
    // 密码正确，更新密码
    let r = await db("update user set password=? where username=?", [
      // 设置新密码也需要加密
      utility.md5(req.body.newPwd),
      req.user.username,
    ]);
    if (r && r.affectedRows > 0) {
      res.json({
        status: 0,
        message: "更新密码成功！",
      });
    } else {
      res.json({
        status: 1,
        message: "更新密码失败！",
      });
    }
  }
});

// 更新头像
router.post("/update/avatar", async (req, res) => {
  let r = await db("update user set user_pic=?where username=?", [
    req.body.avatar,
    req.user.username,
  ]);
  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "更新头像成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "更新头像失败！",
    });
  }
});

module.exports = router;
