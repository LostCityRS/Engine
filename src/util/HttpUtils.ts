import fs from 'fs';

import axios from 'axios';

export async function downloadInMemory(url: string): Promise<Buffer | null> {
    try {
        const req = await axios.get(url, { responseType: 'arraybuffer' });
        return req.data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function downloadToFile(url: string, output: string): Promise<boolean> {
    try {
        const req = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(output, req.data);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
