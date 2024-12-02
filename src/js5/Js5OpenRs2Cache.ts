import fs from 'fs';
import { pipeline } from 'stream/promises';

import axios from 'axios';
import * as tar from 'tar';

type OpenRs2Xtea = {
    archive: number;
    group: number;
    name_hash: number;
    name: string;
    mapsquare: string;
    key: number[];
};

export default class Js5OpenRs2Cache {
    static OSRS_1 = new Js5OpenRs2Cache(241);

    id: number;

    constructor(id: number) {
        this.id = id;
    }

    async predownload(): Promise<boolean> {
        fs.mkdirSync('data/cache', { recursive: true });

        if (!fs.existsSync('data/cache/flat-file.tar.gz')) {
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

    async getKeys(): Promise<OpenRs2Xtea[]> {
        fs.mkdirSync('data/cache', { recursive: true });
        if (fs.existsSync('data/cache/keys.json')) {
            return JSON.parse(fs.readFileSync('data/cache/keys.json', 'ascii'));
        }

        try {
            const req = await axios.get(`https://archive.openrs2.org/caches/runescape/${this.id}/keys.json`, { responseType: 'text' });
            fs.writeFileSync('data/cache/keys.json', req.data);
            return JSON.parse(req.data);
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }

        return [];
    }

    async getGroup(archive: number, group: number): Promise<Uint8Array | null> {
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
}
