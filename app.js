const Koa = require("koa");
const cors = require("koa2-cors");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const fs = require("fs");
const path = require("path");
const morgan = require("koa-morgan");

const index = require("./routes/index");

const ENV = app.env;

// error handler
onerror(app);

app.use(cors());

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./logs", "access.log"),
  {
    flags: "a",
  }
);

// setup the logger
if (ENV === "dev" || ENV === "test") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: accessLogStream,
    })
  );
}

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(index.routes(), index.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
