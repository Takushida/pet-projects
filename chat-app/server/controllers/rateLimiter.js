const redisClient = require("../redis");

const rateLimiter = async (req, res, next) => {
  const ip = req.connection.remoteAddress;
  const [response] = await redisClient.multi().incr(ip).expire(ip, 60).exec();
  if (response[1] > 20) {
    res.json({ loggedIn: false, status: "Too many request" });
  } else {
    next();
  }
};

module.exports = { rateLimiter };
