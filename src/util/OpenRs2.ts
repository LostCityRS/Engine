import fs from 'fs';
import { pipeline } from 'stream/promises';

import axios from 'axios';
import * as tar from 'tar';

type OpenRs2Xtea = {
    archive: number;
    group: number;
    name_hash: number;
    name: string;
    mapsquare: number;
    key: number[];
};

export default class OpenRs2 {
    static OSRS_1 = new OpenRs2(241);

    id: number;
    keys: OpenRs2Xtea[] = [];

    constructor(id: number) {
        this.id = id;
    }

    async predownload() {
        fs.mkdirSync('data/cache', { recursive: true });

        if (!fs.existsSync('data/cache/flat-file.tar.gz')) {
            console.log('Downloading, please wait...');
            try {
                const writer = fs.createWriteStream('data/cache/flat-file.tar.gz');
                const req = await axios.get(`https://archive.openrs2.org/caches/runescape/${this.id}/flat-file.tar.gz`, { responseType: 'stream' });

                // we could pipe directly to tar but users might like to have the original cache around
                await pipeline(
                    req.data,
                    writer
                );
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message);
                }

                return false;
            }
        }

        if (!fs.existsSync('data/cache/255/255.dat')) {
            console.log('Extracting, please wait...');
            await this.getGroup(255, 255); // not included in the flat-file archive!

            await pipeline(
                fs.createReadStream('data/cache/flat-file.tar.gz'),
                tar.x({
                    strip: 1,
                    C: 'data/cache',
                    keep: true
                })
            );
        }

        return true;
    }

    async getGroup(archive: number, group: number) {
        fs.mkdirSync(`data/cache/${archive}`, { recursive: true });
        if (fs.existsSync(`data/cache/${archive}/${group}.dat`)) {
            return Uint8Array.from(fs.readFileSync(`data/cache/${archive}/${group}.dat`));
        }

        try {
            const req = await axios.get(`https://archive.openrs2.org/caches/runescape/${this.id}/archives/${archive}/groups/${group}.dat`, { responseType: 'arraybuffer' });
            fs.writeFileSync(`data/cache/${archive}/${group}.dat`, req.data);
            return Uint8Array.from(req.data);
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }

        return null;
    }

    async loadKeys() {
        fs.mkdirSync('data/cache', { recursive: true });
        if (fs.existsSync('data/cache/keys.json')) {
            this.keys = JSON.parse(fs.readFileSync('data/cache/keys.json', 'ascii'));
            return;
        }

        try {
            console.log('Downloading map keys');
            const req = await axios.get(`https://archive.openrs2.org/caches/runescape/${this.id}/keys.json`, { responseType: 'text' });
            fs.writeFileSync('data/cache/keys.json', req.data);
            this.keys = JSON.parse(req.data);
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }

    getKey(x: number, z: number) {
        const id = x << 8 | z;

        const entry = this.keys.find(k => k.mapsquare === id);
        if (!entry) {
            return [0, 0, 0, 0];
        } else {
            return entry.key;
        }
    }
}
