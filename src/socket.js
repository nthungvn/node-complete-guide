let _io;

module.exports = {
  init: (httpServer, options) => {
    const opts = options || {};
    if (!_io) {
      _io = require('socket.io')(httpServer, opts);
    }
    return _io;
  },

  io: () => {
    return _io;
  },
};
