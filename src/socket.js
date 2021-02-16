let io;

module.exports = {
  init: (httpServer, options) => {
    const opts = options || {};
    if (!io) {
      io = require('socket.io')(httpServer, opts);
    }
    return io;
  },

  getIO: () => {
    return io;
  },
};
