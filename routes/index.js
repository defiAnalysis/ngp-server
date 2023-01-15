const router = require("koa-router")();

const { SuccessModel, ErrorModel } = require("../model/resModel");

const { isStringEmpty } = require("../util/util");

router.prefix("/api/mint");

const {
  getMintDetail,
  getMintDetailCount,
  getClaimDashboard,
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

module.exports = router;
