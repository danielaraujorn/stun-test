const stun = require("stun");
const logger = require('heroku-logger'); 

const server = stun.createServer({ type: "udp4" });

const { STUN_BINDING_RESPONSE, STUN_EVENT_BINDING_REQUEST } = stun.constants;
const userAgent = `node/${process.version} stun/v1.0.0`;

server.on(STUN_EVENT_BINDING_REQUEST, (request, rinfo) => {
  logger.info('here');
  logger.info(rinfo);
  const message = stun.createMessage(
    STUN_BINDING_RESPONSE,
    request.transactionId
  );

  message.addXorAddress(rinfo.address, rinfo.port);
  message.addSoftware(userAgent);

  server.send(message, rinfo.port, rinfo.address);
});

server.listen(process.env.PORT || 19302, () => {
  console.log("[stun] server started");
});
