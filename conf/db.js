const env = process.env.NODE_ENV;

let MYSQL_CONF;
let REDIS_CONF;
let PRV1 = "0xb8faa392ff0cb04a9a623bcc521c4e2184882889aa69899f9bd12f7d1b185cea";
let PRV2 = "0x83f290782ba4e995a4c934f45799a956a0ce2a9d9703a3715472727dc6c85d44";
let PRV3 = "0xb1a82552591c92f41e7d3b5bcfa346f10815fb8b9e709e4fb63345705d45cc65";

let FTMPROVIDER = "https://endpoints.omniatech.io/v1/eth/goerli/public";

let ngp_addr = "0x2fAD18285F4192A130752030D07fA39f9923Ad16";

if (env === "dev") {
  MYSQL_CONF = {
    host: "120.25.239.33",
    user: "root",
    password: "ngp123456",
    port: "7006",
    database: "ngpdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
  REDIS_CONF = {
    host: "120.25.239.33",
    port: "7069",
  };
  MQ_CONF = {
    host: "120.25.239.33",
    port: "7082",
  };
}

if (env === "prd") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "ngp123456",
    port: "7006",
    database: "ngpdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
  REDIS_CONF = {
    host: "localhost",
    port: "7069",
  };
  MQ_CONF = {
    host: "localhost",
    port: "7082",
  };
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
  MQ_CONF,
  PRV1,
  PRV2,
  PRV3,
  FTMPROVIDER,
  ngp_addr,
};
