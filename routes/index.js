const router = require("koa-router")();

const { SuccessModel, ErrorModel } = require("../model/resModel");

const { isStringEmpty } = require("../util/util");

router.prefix("/api/mint");

const {
  getMintDetail,
  getMintDetailCount,
  getClaimDashboard,
  getMeshReward,
  getRandomRewards,
  getHolders,
  getDegreeHeat,
  receive,
} = require("../controller/index");

router.get("/details", async (ctx, next) => {
  const sender = ctx.query.sender;
  const type = ctx.query.type;

  let page = ctx.query.page;
  const count = 10;

  if (!Number(page) || page <= 0 || isStringEmpty(page)) {
    page = 1;
  }

  if (!Number(type) || (type != 1 && type != 2)) {
    console.error("/details error", err);

    ctx.body = new ErrorModel({ data: [], message: "error type" });
  }

  page = (page - 1) * count;

  let sqldata = {};
  let totalCount = 0;
  try {
    sqldata = await getMintDetail(sender, type, page, count);

    totalCount = await getMintDetailCount(sender, type, page, count);

    console.log("totalCount:=====", totalCount);

    ctx.body = new SuccessModel({
      data: sqldata,
      totalCount: totalCount[0].count,
    });
  } catch (err) {
    console.error("/details sql error", err);

    ctx.body = new ErrorModel({ data: [] });
  }
});

router.get("/dashboard", async (ctx, next) => {
  const sender = ctx.query.sender;

  try {
    sqldata = await getClaimDashboard(sender);

    ctx.body = new SuccessModel({
      data: sqldata,
    });
  } catch (err) {
    console.error("/dashboard sql error", err);

    ctx.body = new ErrorModel({ data: [] });
  }
});

router.get("/meshReward", async (ctx, next) => {
  let page = ctx.query.page;
  const count = 10;

  if (!Number(page) || page <= 0 || isStringEmpty(page)) {
    page = 1;
  }

  page = (page - 1) * count;

  try {
    sqldata = await getMeshReward(page, count);

    ctx.body = new SuccessModel({
      data: sqldata,
    });
  } catch (err) {
    console.error("/meshReward sql error", err);

    ctx.body = new ErrorModel({ data: [] });
  }
});

router.get("/randomRewards", async (ctx, next) => {
  let page = ctx.query.page;
  const count = 10;

  if (!Number(page) || page <= 0 || isStringEmpty(page)) {
    page = 1;
  }

  page = (page - 1) * count;

  try {
    sqldata = await getRandomRewards(page, count);

    ctx.body = new SuccessModel({
      data: sqldata,
    });
  } catch (err) {
    console.error("/randomRewards sql error", err);

    ctx.body = new ErrorModel({ data: [] });
  }
});

router.get("/handle", async (ctx, next) => {
  try {
    sqldata = await getHolders("0x949E0a0672299E6fcD6bec3Bd1735d6647b20618");

    ctx.body = new SuccessModel({
      data: sqldata,
    });
  } catch (err) {
    console.error("/handle sql error", err);

    ctx.body = new ErrorModel({ data: [] });
  }
});

router.get("/degreeHeat", async (ctx, next) => {
  //最小经度
  const minLongitude = ctx.query.minLongitude;
  const maxLongitude = ctx.query.maxLongitude;

  //最小维度
  const minLatitude = ctx.query.minLatitude;
  const maxLatitude = ctx.query.maxLatitude;

  try {
    sqldata = await getDegreeHeat(
      minLongitude,
      maxLongitude,
      minLatitude,
      maxLatitude
    );

    ctx.body = new SuccessModel({
      data: sqldata,
    });
  } catch (err) {
    console.error("/degreeHeat sql error", err);

    ctx.body = new ErrorModel({ data: [] });
  }
});

router.post("/receive", async (ctx, next) => {
  const sender = ctx.request.body.address;

  console.log("sender:", sender);

  if (isStringEmpty(sender)) {
    console.error("/receive sender error");

    ctx.body = new ErrorModel({ data: "receive sender error" });

    return;
  }

  try {
    sqldata = await receive(sender);

    ctx.body = new SuccessModel({
      data: sqldata,
    });
  } catch (err) {
    console.error("/receive sql error", err);

    ctx.body = new ErrorModel({ data: [] });

    return;
  }
});

module.exports = router;
