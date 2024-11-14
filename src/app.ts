import net from 'net';

// not http because it can switch modes
const lobby = net.createServer((socket) => {
    console.log(socket.remoteAddress, 'connected on 443');
});
lobby.listen(443);

// in a production environment, lobby/world are the same ports but different IPs
// in a local environment, you need to either change the ports (params) or run both in the same process
const world = net.createServer((socket) => {
    console.log(socket.remoteAddress, 'connected on 43594');
});
world.listen(43594);
