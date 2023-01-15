const mysql = require("mysql2/promise");
const { MYSQL_CONF } = require("../conf/db");
let db = {};

const pool = mysql.createPool(MYSQL_CONF);

db.dowork = async (sql, paras = "") => {
  try {
    let conn = await pool.getConnection();

    let [rows] = await conn.query(sql, paras);
    conn.release();

    return rows;
  } catch (err) {
    throw err;
  }
};

db.escape = async (data) => {
  try {
    return mysql.escape(data);
  } catch (err) {
    throw err;
  }
};

module.exports = { db };
