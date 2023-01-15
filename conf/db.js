const env = process.env.NODE_ENV;

let MYSQL_CONF;
let REDIS_CONF;

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
};
