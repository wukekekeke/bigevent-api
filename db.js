function db(sql, params = null) {
  const mysql = require("mysql");
  const conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "big-event",
  });

  return new Promise((resolve, reject) => {
    conn.connect();
    conn.query(sql, params, (err, result) => {
      err ? reject(err) : resolve(result);
    });
    conn.end();
  }).catch((err) => {
    //统一做错误处理
    console.log(err);
  });
}

module.exports = db;
