const express = require("express");
const router = express.Router();
const db = require("../db");

// 获取文章分类
router.get("/cates", async (req, res) => {
  //   let r = await db("select * from category where 'delete'=1");
  let r = await db("select * from category");
  // 只要查询到了，哪怕是空数组，也做出响应
  if (r) {
    res.json({
      status: 0,
      message: "获取文章分类列表成功！",
      data: r,
    });
  } else {
    res.json({
      status: 1,
      message: "获取文章分类列表失败！",
    });
  }
});

// 新增文章分类
router.post("/addcates", async (req, res) => {
  let r = await db("insert into category set ?", req.body);
  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "新增文章分类成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "新增文章分类失败！",
    });
  }
});

// 删除文章分类
router.get("/deletecate/:id", async (req, res) => {
  let id = req.params.id; //获取动态参数
  let r = await db("delete from category where id=?", id);
  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "删除文章分类成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "删除文章分类失败！",
    });
  }
});

// 更新分类数据
router.post("/updatecate", async (req, res) => {
  let params = {
    name: req.body.name,
    alias: req.body.alias,
  };
  let r = await db("update category set ? where Id=?", [params, req.body.Id]);
  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "更新分类信息成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "更新分类信息失败！",
    });
  }
});

module.exports = router;
