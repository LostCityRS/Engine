import fs from 'fs';
import net from 'net';

import { JavaConfig, NxtClientBinaryType } from '../jagex/JavaConfig.ts';
import Packet from '../jagex/Packet.ts';

if (!fs.existsSync('data/client')) {
    fs.mkdirSync('data/client', { recursive: true });
}

if (!fs.existsSync('data/client/jav_config.ws')) {
    const config = await JavaConfig.decodeFromRs3(NxtClientBinaryType.MacOS);
    if (!config) {
        console.error('Failed to download template jav_config.ws');
        process.exit(1);
    }

    fs.writeFileSync('data/client/jav_config.ws', config.encode(true));
}

const config = JavaConfig.decode(fs.readFileSync('data/client/jav_config.ws', 'ascii'));
if (!config) {
    console.error('Failed to decode jav_config.ws');
    process.exit(1);
}

// todo: port is also a config param
const lobby = net.createConnection({ host: 'content.runescape.com', port: 443 }, () => {
    const req = Packet.alloc(1000);
    req.p1(15); // INIT_JS5REMOTE_CONNECTION
    req.p1(0); // size
    const start = req.pos;
    req.p4(config.serverVersion); // major rev
    req.p4(1); // minor rev
    req.pjstr(config.token); // token
    req.p1(0); // lang id
    req.psize1(req.pos - start);
    lobby.write(req.data);

    lobby.on('data', (data) => {
        console.log(data);
    });
});
