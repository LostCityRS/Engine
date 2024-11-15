import fs from 'fs';

import { sleep } from '#lostcity/util/Time.js';

import { JavaConfig, NxtClientBinaryType } from '#jagex/client/JavaConfig.js';
import Js5TcpClient from '#jagex/js5/Js5TcpClient.js';

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

const js5 = await Js5TcpClient.connectToRs3(config);
js5.request(config, true, 255, 255);

js5.client.pos = 0;
await js5.stream.readBytes(js5.client, 5, 0);
const archive = js5.client.g1();
const groupPrefetch = js5.client.g4();
const prefetch: boolean = (groupPrefetch & 0x80000000) != 0;
const group: number = (groupPrefetch & ~0x80000000);
console.log(`received data for archive:${archive} prefetch:${prefetch} group:${group}`);

js5.server.pos = 0;
await js5.stream.readBytes(js5.server, 5, 0);
const compression = js5.server.g1();
const length = js5.server.g4();
console.log(`compression method:${compression} length:${length}`);

const totalLength = compression === 0 ? length + 5 : length;
const file = Buffer.alloc(totalLength);
file.set(js5.server.raw);
await js5.stream.readBytes(file, length, 5);
console.log(file);

await sleep(5000);
js5.stream.close();
