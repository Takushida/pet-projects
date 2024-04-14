const redisClient = require("../redis");

const authorizeUser = (socket, next) => {
  if (!socket.request.session.user || !socket.request.session) {
    next(new Error("Non-authorized request"));
  } else {
    next();
  }
};

const initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  socket.join(socket.user.userid);
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "connected",
    true
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);
  if (friendRooms.length > 0)
    socket.to(friendRooms).emit("connected", true, socket.user.username);
  socket.emit("friends", parsedFriendList);

  const messagesQuery = await redisClient.lrange(
    `chat:${socket.user.userid}`,
    0,
    -1
  );

  const messages = messagesQuery.map((messageString) => {
    const parsedString = messageString.split(".");
    return {
      to: parsedString[0],
      from: parsedString[1],
      content: parsedString[2],
    };
  });
  if (messages && messages.length > 0) {
    socket.emit("messages", messages);
  }
};

const addFriend = async (socket, friendName, callback) => {
  if (friendName === socket.user.username) {
    callback({ done: false, errorMsg: "Can't add self" });
    return;
  }
  const friend = await redisClient.hgetall(`userid:${friendName}`);
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  if (Object.keys(friend).length === 0) {
    callback({ done: false, errorMsg: "User doesn't exist" });
    return;
  }
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    callback({ done: false, errorMsg: "Friend's alredy in friend list" });
    return;
  }
  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [friendName, friend.userid].join(".")
  );
  const newFriend = {
    username: friendName,
    userid: friend.userid,
    connected: friend.connected,
  };
  callback({ done: true, newFriend });
};

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parsedFriend = friend.split(".");
    const friendStatus = await redisClient.hget(
      `userid:${parsedFriend[0]}`,
      "connected"
    );
    newFriendList.push({
      username: parsedFriend[0],
      userid: parsedFriend[1],
      connected: friendStatus,
    });
  }
  return newFriendList;
};

onDisconnect = async (socket) => {
  await redisClient.hset(`userid:${socket.user.username}`, "connected", false);
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const friendRooms = await parseFriendList(friendList).then((friends) =>
    friends.map((friend) => friend.userid)
  );
  socket.to(friendRooms).emit("connected", false, socket.user.username);
};

const dm = async (socket, message) => {
  message.from = socket.user.userid;
  const messageString = [message.to, message.from, message.content].join(".");
  await redisClient.lpush(`chat:${message.to}`, messageString);
  await redisClient.lpush(`chat:${message.from}`, messageString);
  socket.to(message.to).emit("dm", message);
};

module.exports = { authorizeUser, addFriend, initializeUser, onDisconnect, dm };
