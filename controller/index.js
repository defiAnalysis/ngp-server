let { db } = require("./../db/db");

const getMintDetail = async (
  sender = "0x0000000000000000000000000000000000000000",
  type = 1,
  page = 1,
  count = 10
) => {
  let sql = `SELECT number,63792 received,372 unreceived from ngp_mint WHERE user =  "${sender}" `;

  sql += ` order by createTs desc `;

  sql += ` limit ${page},${count}`;

  return await db.dowork(sql);
};

const getMintDetailCount = async (
  sender = "0x0000000000000000000000000000000000000000",
  type = 1
) => {
  let sql = `select count(*) count from ngp_mint WHERE user =  "${sender}"  `;

  return await db.dowork(sql);
};

const getClaimDashboard = async (
  sender = "0x0000000000000000000000000000000000000000"
) => {
  let sql = `SELECT 0 totalEarnings,63792 undrawnEarnings,372 decayedEarnings,1 totalClaimMeshs `;

  return await db.dowork(sql);
};

module.exports = {
  getMintDetail,
  getMintDetailCount,
  getClaimDashboard,
};
