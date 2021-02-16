let _io;

module.exports = {
  init: (httpServer, options) => {
    const opts = options || {};
    _io = require('socket.io')(httpServer, opts);
    return _io;
  },

  io: () => {
    if (!_io) {
      throw new Error('Socket did not initialize');
    }
    return _io;
  },
};
