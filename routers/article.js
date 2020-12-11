const express = require("express");
const router = express.Router();
const db = require("../db");
const path = require("path");

// 处理时间
const moment = require("moment");

// formdata格式提交的post请求，需要用第三方模块multer
const multer = require("multer");

// 配置上传文件的文件夹
const upload = multer({
  dest: path.join(__dirname, "../uploads"),
});

//在路由的第二个参数，配置接口文档规定的图片名字
// 发布新文章
router.post("/add", upload.single("cover_img"), async (req, res) => {
  //   console.log(req.body); //拿到文本信息
  /* 
 {
  title: '文章标题1',
  cate_id: '2',
  content: '内容',
  state: '已发布'
}
*/
  //   console.log(req.file);//拿到文件信息
  /* 
{
  fieldname: 'cover_img',
  originalname: '01.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'C:\\Users\\admin\\Desktop\\Node.js\\12.8\\keke-big-event-server\\uploads',
  filename: 'a0d57b441adece4301273f90dc0e0d91',
  path: 'C:\\Users\\admin\\Desktop\\Node.js\\12.8\\keke-big-event-server\\uploads\\a0d57b441adece4301273f90dc0e0d91',
  size: 60262
}
*/
  // filename 是上传到服务器保存的文件名

  // 组装数据
  let obj = req.body;
  //把req.body上没有的附上值
  obj.cover_img = req.file.filename;
  // 处理时间
  obj.pub_date = moment().format("YYYY-MM-DD hh:mm:ss");
  obj.author_id = req.user.id;

  // 添加到数据库
  let r = await db("insert into article set ?", obj);
  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "发布文章成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "发布文章失败！",
    });
  }
});

// 获取文章列表
router.get("/list", async (req, res) => {
  // 接收所有的请求参数
  // let pagenum = req.query.pagenum;
  // let pagesize = req.query.pagesize;
  // let cate_id = req.query.cate_id;
  // let state = req.query.state;
  // 使用解构的方式，获取请求参数
  let { pagenum, pagesize, cate_id, state } = req.query;
  //   先判断必填参数是否存在
  // if(pagenum&&pagesize)
  // 反过来
  if (!pagenum || !pagesize) {
    return res.json({
      status: 1,
      message: "缺少必要参数",
    });
  }

  // 生成where条件，完成筛选工作
  let w = "";
  if (cate_id) {
    w += " and cate_id=" + cate_id; // 注意前面有空格
  }
  if (state) {
    w += ` and state = '${state}'`; // 注意前面有空格
  }

  // 下面查询数据，把结果响应给客户端
  let sql = `select a.Id, a.title, a.pub_date, a.state, c.name cate_name from article a
join category c on a.cate_id=c.Id
join user u on u.id=a.author_id
where u.id = ? ${w}
limit ${(pagenum - 1) * pagesize}, ${pagesize}`;

  let r = await db(sql, req.user.id);

  // 查询总记录数
  let r2 = await db(
    "select count(*) as total from article where author_id=?" + w,
    req.user.id
  );
  if (r && r2) {
    res.json({
      status: 0,
      message: "获取数据列表成功",
      data: r,
      total: r2[0].total,
    });
  } else {
    res.json({
      status: 1,
      message: "查询失败",
    });
  }
});

// 根据 Id 删除文章
router.get("/delete/:id", async (req, res) => {
  let id = req.params.id; // 获取动态数据
  let r = await db("delete from article where Id=?", id);
  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "删除成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "删除失败！",
    });
  }
});

//根据 Id 获取文章
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let r = await db("select * from article where Id=?", id);
  if (r && r.length > 0) {
    res.json({
      status: 0,
      message: "获取文章成功！",
      data: r[0],
    });
  } else {
    res.json({
      status: 0,
      message: "获取文章失败！",
    });
  }
});

// 根据 Id 更新文章,formdata格式提交的数据
router.post("/edit", upload.single("cover_img"), async (req, res) => {
  let obj = req.body; // 拿到文本格式的信息
  // 判断修改的时候有没有修改图片
  if (req.file) {
    obj.cover_img = req.file.filename; //拿到图片
  }
  let r = await db("update article set ? where Id=?", [obj, req.body.Id]);
  if (r && r.affectedRows > 0) {
    res.json({
      status: 0,
      message: "修改文章成功！",
    });
  } else {
    res.json({
      status: 1,
      message: "修改文章失败！",
    });
  }
});

module.exports = router;
