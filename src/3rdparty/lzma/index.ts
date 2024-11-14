import lzma from 'lzma-native';

// as of writing: lzma library fails to decompress using the Bun runtime
export function decompressLzma(compressed: Buffer): Promise<Buffer> {
    // compression information flags needs to be unset in this lib
    for (let i = 5; i < 13; i++) {
        compressed[i] = 0xFF;
    }

    return lzma.decompress(compressed);
}
