// for localhost
// module.exports = {
//     HOST: "localhost",
//     USER: "root",
//     PASSWORD: "",
//     DB: "nodeproject",
//     dialect: "mysql",
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   };

// for live server
module.exports = {
  HOST: "containers-us-west-101.railway.app",
  USER: "root",
  PASSWORD: "a0hRM4FbT7Z4pwa2Hbd2",
  DB: "railway",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};