let { db } = require("./../db/db");
const fetch = require("node-fetch");

let ethers = require("ethers");

const ABI = require("../abi");
const constAddr = require("../conf/db");

const getMintDetail = async (
  sender = "0x0000000000000000000000000000000000000000",
  type = 1,
  page = 0,
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

const getMeshReward = async (page = 0, count = 10) => {
  let sql = `SELECT @rownum := @rownum+1 AS no,number,e reward,link from (SELECT @rownum:=0) r,ngp_rank ORDER BY e DESC `;

  sql += ` limit ${page},${count}`;

  return await db.dowork(sql);
};

const getRandomRewards = async (page = 0, count = 10) => {
  let sql = `SELECT @rownum := @rownum+1 AS no,number,link,rewards from (SELECT @rownum:=0) r,ngp_random where DATE(updateTs) = date_sub(curdate(),interval 1 day)  `;

  sql += ` limit ${page},${count}`;

  return await db.dowork(sql);
};

const getHolders = async (contract) => {
  const holders = await fetch(
    `https://api.bscscan.com/api?module=token&action=tokenholderlist&contractaddress=${contract}&page=1&offset=20&apikey=UJM9AQC9DHYBF94HB7U7NSCNDNXJ1Q6MRG`
  )
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(error);
    });
  return holders;
};

const getDegreeHeat = async (
  minLongitude = 0,
  maxLongitude = 0,
  minLatitude = 0,
  maxLatitude = 0
) => {
  let sql = `SELECT a.number,b.e,b.count from ngp_number a LEFT JOIN ngp_rank b on a.number = b.number where a.latitude >= ${minLongitude} and a.latitude <= ${maxLongitude} and a.longitude >= ${minLatitude} and a.longitude <= ${maxLatitude}  `;

  return await db.dowork(sql);
};

const receive = async (sender) => {
  if (!ethers.utils.isAddress(sender)) {
    console.error("not sender");

    return;
  }

  const provider = new ethers.providers.JsonRpcProvider(constAddr.FTMPROVIDER);

  const ngp_obj = new ethers.Contract(
    constAddr.ngp_addr,
    ABI.ngp_abi,
    provider
  );

  let resu1 = await Sign(sender, constAddr.PRV1);

  console.log("resu1 = " + resu1);

  let resu2 = await Sign(sender, constAddr.PRV2);
  console.log("resu2 = " + resu2);

  let vs = [];
  vs.push(resu1[0]);
  vs.push(resu2[0]);

  let rs = [];
  rs.push(resu1[1]);
  rs.push(resu2[1]);

  let ss = [];
  ss.push(resu1[2]);
  ss.push(resu2[2]);

  const signer = await new ethers.Wallet(constAddr.PRV1, provider);

  let tx = await ngp_obj
    .connect(signer)
    .claimMintReward(sender, "1000000000", vs, rs, ss);

  console.log("tx:", tx);

  let status = await tx.wait();

  console.log("status:", status);
};

async function Sign(sender, privateKey) {
  let prefix = "\x19Ethereum Signed Message:\n32";

  let signingKey = new ethers.utils.SigningKey(privateKey);

  const provider = new ethers.providers.JsonRpcProvider(constAddr.FTMPROVIDER);

  const ngp_obj = new ethers.Contract(
    constAddr.ngp_addr,
    ABI.ngp_abi,
    provider
  );

  let spendNonce = await ngp_obj.getSpendNonce();

  console.log("spendNonce:", spendNonce);

  let messageHash = ethers.utils.keccak256(
    ethers.utils.solidityPack(
      ["address", "uint256", "uint256"],
      [sender, 5, spendNonce]
    )
  );

  const msg = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string", "bytes32"], [prefix, messageHash])
  );

  let signature = await signingKey.signDigest(msg);

  let { v, r, s } = signature;

  v = v - 27;

  return [v, r, s];
}

module.exports = {
  getMintDetail,
  getMintDetailCount,
  getClaimDashboard,
  getMeshReward,
  getRandomRewards,
  getHolders,
  getDegreeHeat,
  receive,
};
