const { getFilms } = require("../controllers/filmController");
module.exports.respond = (endpoint, socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnect");
    socket.disconnect();
  });

  socket.on("get films", async () => {
    const films = await getFilms();
    socket.emit("films", films);
  });
};
