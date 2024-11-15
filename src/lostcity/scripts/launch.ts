import fs from 'fs';

import { NxtClientBinaryType, JavaConfig } from '#jagex/client/JavaConfig.js';

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

// config.codeBase = 'http://localhost/'; // only used by launcher to download binaries
config.param.set('53', 'http://localhost/'); // https://auth.jagex.com/
config.param.set('59', 'http://localhost/'); // https://auth.runescape.com/
config.param.set('49', 'localhost'); // content.runescape.com
config.param.set('36', 'http://localhost/m'); // https://secure.runescape.com/m
config.param.set('35', 'http://localhost'); // https://world2a.runescape.com
config.param.set('54', 'http://localhost/'); // https://payments.jagex.com/
config.param.set('3', 'localhost'); // lobby47a.runescape.com
config.param.set('56', 'http://localhost/'); // https://social.auth.jagex.com/
config.param.set('16', '.localdomain'); // .runescape.com
config.param.set('37', 'localhost'); // content.runescape.com
config.param.set('40', 'http://localhost'); // https://world2a.runescape.com
config.param.set('58', 'http://localhost/'); // https://account.jagex.com/

config.launchRs3();
