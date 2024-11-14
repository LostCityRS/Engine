import child_process from 'child_process';
import fs from 'fs';

import axios from 'axios';

import { downloadInMemory, downloadToFile } from './HttpUtils.ts';
import { decompressLzma } from './3rdparty/lzma/index.ts';

export enum ClientBinaryType {
    WinXP, // removed
    Win32, // removed
    Win64,
    MacOS,
    Linux,
    Win32Compatibility, // removed
    Win64Compatibility,
    Android, // (empty)
    iOS, // (empty)
    MacOS_2, // guessing: ARM?
    Unknown, // (empty) guessing: second variant of android
}

export class JavaConfig {
    static decode(input: string) {
        const config = new JavaConfig();

        const downloads: Map<string, string> = new Map();
        let binaryCount = 0;

        const lines = input.split('\n');
        for (const line of lines) {
            const [key, value, extra] = line.split('=', 3);

            if (key === 'title') {
                config.title = value;
            } else if (key === 'adverturl') {
                config.advertUrl = value;
            } else if (key === 'codebase') {
                config.codeBase = value;
            } else if (key === 'cachedir') {
                config.cacheDir = value;
            } else if (key === 'storebase') {
                config.storeBase = parseInt(value);
            } else if (key === 'initial_jar') {
                config.initialJar = value;
            } else if (key === 'initial_class') {
                config.initialClass = value;
            } else if (key === 'viewerversion') {
                config.viewerVersion = parseInt(value);
            } else if (key === 'win_sub_version') {
                config.winSubVersion = parseInt(value);
            } else if (key === 'mac_sub_version') {
                config.macSubVersion = parseInt(value);
            } else if (key === 'other_sub_version') {
                config.otherSubVersion = parseInt(value);
            } else if (key === 'browsercontrol_win_x86_jar') {
                config.browserControlWin32Jar = value;
            } else if (key === 'browsercontrol_win_amd64_jar') {
                config.browserControlWin64Jar = value;
            } else if (key === 'binary_name') {
                config.binaryName = value;
            } else if (key.startsWith('download_')) {
                downloads.set(key, value);
            } else if (key === 'binary_count') {
                binaryCount = parseInt(value);
            } else if (key === 'launcher_version') {
                config.launcherVersion = parseInt(value);
            } else if (key === 'server_version') {
                config.serverVersion = parseInt(value);
            } else if (key === 'launcher_sub_version') {
                config.launcherSubVersion = parseInt(value);
            } else if (key === 'cache_variant_suffix') {
                config.cacheVariantSuffix = value;
            } else if (key === 'nxt_gpu_drivers_url') {
                config.nxtGpuDriversUrl = value;
            } else if (key === 'termsurl') {
                config.termsUrl = value;
            } else if (key === 'privacyurl') {
                config.privacyUrl = value;
            } else if (key === 'gedigesturl') {
                config.geDigestUrl = value;
            } else if (key === 'download') {
                config.download = parseInt(value);
            } else if (key === 'window_preferredwidth') {
                config.windowPreferredWidth = parseInt(value);
            } else if (key === 'window_preferredheight') {
                config.windowPreferredHeight = parseInt(value);
            } else if (key === 'advert_height') {
                config.advertHeight = parseInt(value);
            } else if (key === 'applet_minwidth') {
                config.appletMinWidth = parseInt(value);
            } else if (key === 'applet_minheight') {
                config.appletMinHeight = parseInt(value);
            } else if (key === 'applet_maxwidth') {
                config.appletMaxWidth = parseInt(value);
            } else if (key === 'applet_maxheight') {
                config.appletMaxHeight = parseInt(value);
            } else if (key === 'msg') {
                config.msg.set(value, extra);
            } else if (key === 'param') {
                config.param.set(value, extra);
            }
        }

        for (let binary = 0; binary < binaryCount; binary++) {
            const name = downloads.get(`download_name_${binary}`);
            const crc = downloads.get(`download_crc_${binary}`);
            const hash = downloads.get(`download_hash_${binary}`);

            if (typeof name === 'undefined' || typeof crc === 'undefined' || typeof hash === 'undefined') {
                console.error(`Failed to decode binary download ${binary}`);
                break;
            }

            config.downloads.push({
                name,
                crc: parseInt(crc),
                hash
            });
        }

        return config;
    }

    static async decodeFromUrl(url: string) {
        try {
            const req = await axios.get(url, { responseType: 'text', responseEncoding: 'utf8' });
            return JavaConfig.decode(req.data as string);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static async decodeFromRs3(type: ClientBinaryType) {
        const config = await JavaConfig.decodeFromUrl(`https://www.runescape.com/jav_config.ws?binaryType=${type}`);

        if (config) {
            config.binaryType = type;
        }

        return config;
    }

    static async decodeFromOsrs() {
        return JavaConfig.decodeFromUrl('https://oldschool.runescape.com/jav_config.ws');
    }

    binaryType: ClientBinaryType | null = null;

    title: string = '';
    advertUrl: string = '';
    codeBase: string = '';
    termsUrl: string = '';
    privacyUrl: string = '';
    download: number = 0;
    windowPreferredWidth: number = 0;
    windowPreferredHeight: number = 0;
    advertHeight: number = 0;
    appletMinWidth: number = 0;
    appletMinHeight: number = 0;
    appletMaxWidth: number = 0;
    appletMaxHeight: number = 0;
    msg: Map<string, string> = new Map();
    param: Map<string, string> = new Map();

    // java
    storeBase: number = 0;
    initialJar: string = '';
    initialClass: string = '';
    browserControlWin32Jar: string = '';
    browserControlWin64Jar: string ='';
    viewerVersion: number = 0;
    winSubVersion: number = 0;
    macSubVersion: number = 0;
    otherSubVersion: number = 0;

    // java osrs
    cacheDir: string | null = null;
    geDigestUrl: string | null = null;

    // nxt rs3
    binaryName: string = '';
    downloads: {
        name: string,
        crc: number,
        hash: string
    }[] = [];
    launcherVersion: number = 0;
    serverVersion: number = 0;
    launcherSubVersion: number = 0;
    cacheVariantSuffix: string = '';
    loadingImage: string | null = null;
    nxtGpuDriversUrl: string = '';

    encode(nxt: boolean) {
        const output: string[] = [];

        output.push(`title=${this.title}`);
        output.push(`adverturl=${this.advertUrl}`);
        output.push(`codebase=${this.codeBase}`);

        if (nxt) {
            // binary_name and binary_count still get written even if no downloads
            output.push(`binary_name=${this.binaryName}`);
            for (let i = 0; i < this.downloads.length; i++) {
                output.push(`download_name_${i}=${this.downloads[i].name}`);
                output.push(`download_crc_${i}=${this.downloads[i].crc}`);
                output.push(`download_hash_${i}=${this.downloads[i].hash}`);
            }
            output.push(`binary_count=${this.downloads.length}`);

            output.push(`launcher_version=${this.launcherVersion}`);
            output.push(`server_version=${this.serverVersion}`);

            if (this.launcherSubVersion !== 0) {
                // doesn't seem to always be written, so I'll assume this is why
                output.push(`launcher_sub_version=${this.launcherSubVersion}`);
            }

            output.push(`cache_variant_suffix=${this.cacheVariantSuffix}`);

            if (this.loadingImage !== null) {
                output.push(`loading_image=${this.loadingImage}`);
            }

            if (this.nxtGpuDriversUrl !== null) {
                output.push(`nxt_gpu_drivers_url=${this.nxtGpuDriversUrl}`);
            }

            output.push(`termsurl=${this.termsUrl}`);
            output.push(`privacyurl=${this.privacyUrl}`);
        } else {
            if (this.cacheDir !== null) {
                // only in osrs
                output.push(`cachedir=${this.cacheDir}`);
            }

            output.push(`storebase=${this.storeBase}`);
            output.push(`initial_jar=${this.initialJar}`);
            output.push(`initial_class=${this.initialClass}`);

            output.push(`termsurl=${this.termsUrl}`);
            output.push(`privacyurl=${this.privacyUrl}`);

            output.push(`viewerversion=${this.viewerVersion}`);
            output.push(`win_sub_version=${this.winSubVersion}`);
            output.push(`mac_sub_version=${this.macSubVersion}`);
            output.push(`other_sub_version=${this.otherSubVersion}`);

            output.push(`browsercontrol_win_x86_jar=${this.browserControlWin32Jar}`);
            output.push(`browsercontrol_win_amd64_jar=${this.browserControlWin64Jar}`);

            if (this.geDigestUrl !== null) {
                output.push(`gedigesturl=${this.geDigestUrl}`);
            }
        }

        output.push(`download=${this.download}`); // cache busting?
        output.push(`window_preferredwidth=${this.windowPreferredWidth}`);
        output.push(`window_preferredheight=${this.windowPreferredHeight}`);
        output.push(`advert_height=${this.advertHeight}`);
        output.push(`applet_minwidth=${this.appletMinWidth}`);
        output.push(`applet_minheight=${this.appletMinHeight}`);
        output.push(`applet_maxwidth=${this.appletMaxWidth}`);
        output.push(`applet_maxheight=${this.appletMaxHeight}`);

        for (const [key, value] of this.msg) {
            output.push(`msg=${key}=${value}`);
        }

        for (const [key, value] of this.param) {
            output.push(`param=${key}=${value}`);
        }

        output.push(''); // seems to add a newline no matter what
        return output.join('\n');
    }

    async downloadAll(): Promise<boolean> {
        if (!fs.existsSync('data/client')) {
            fs.mkdirSync('data/client', { recursive: true });
        }

        try {
            if (this.initialJar.length) {
                // java
                await downloadToFile(`${this.codeBase}${this.initialJar}`, `data/client/${this.initialJar}`);
                await downloadToFile(`${this.codeBase}${this.browserControlWin32Jar}`, `data/client/${this.browserControlWin32Jar}`);
                await downloadToFile(`${this.codeBase}${this.browserControlWin64Jar}`, `data/client/${this.browserControlWin64Jar}`);
            } else {
                // nxt
                console.log(`Revision ${this.serverVersion}`);

                for (const download of this.downloads) {
                    console.log(`Downloading ${download.name}`);
                    const compressed = await downloadInMemory(`${this.codeBase}client?binaryType=${this.binaryType}&fileName=${download.name}&crc=${download.crc}`);

                    if (compressed) {
                        const file = await decompressLzma(compressed);
                        fs.writeFileSync(`data/client/${download.name}`, file);
                    }
                }
            }

            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    launchRs3() {
        if (!fs.existsSync(`data/client/${this.binaryName}`)) {
            this.downloadAll();
        }

        const clientArgs: string[] = [];

        for (const [key, value] of this.param) {
            clientArgs.push(key, value.length ? value : ' ');
        }

        clientArgs.push('0'); // ?
        clientArgs.push('launcher'); // indicating the launcher started it?
        clientArgs.push('931'); // outdated revision...?

        if (process.platform !== 'win32') {
            fs.chmodSync(`data/client/${this.binaryName}`, 755);
        }

        child_process.spawnSync(`data/client/${this.binaryName}`, clientArgs);
    }
}
