export default class Packet {
    static alloc(size: number) {
        return new Packet(new Uint8Array(size));
    }

    #data: Uint8Array;
    pos: number;

    #view: DataView;

    constructor(data: Uint8Array, pos: number = 0) {
        this.#data = new Uint8Array(data);
        this.pos = pos;
        this.#view = new DataView(this.#data.buffer);
    }

    get available(): number {
        return this.#data.length - this.pos;
    }

    get length(): number {
        return this.#data.length;
    }

    get data(): Uint8Array {
        return this.#data.subarray(0, this.pos);
    }

    g1(): number {
        return this.#view.getUint8(this.pos++);
    }

    g1b(): number {
        return this.#view.getInt8(this.pos++);
    }

    g2(): number {
        this.pos += 2;
        return this.#view.getUint16(this.pos - 2);
    }

    g2s(): number {
        this.pos += 2;
        return this.#view.getInt16(this.pos - 2);
    }

    g3(): number {
        const result: number = (this.#view.getUint8(this.pos++) << 16) | this.#view.getUint16(this.pos);
        this.pos += 2;
        return result;
    }

    g4(): number {
        this.pos += 4;
        return this.#view.getInt32(this.pos - 4);
    }

    g8(): bigint {
        this.pos += 8;
        return this.#view.getBigInt64(this.pos - 8);
    }

    gbool(): boolean {
        return this.g1() === 1;
    }

    gdata(dest: Uint8Array, offset: number, length: number): void {
        dest.set(this.data.subarray(this.pos, this.pos + length), offset);
        this.pos += length;
    }

    gjstr(terminator: number = 0): string {
        const length: number = this.data.length;
        let str: string = '';
        let b: number;
        while ((b = this.#view.getUint8(this.pos++)) !== terminator && this.pos < length) {
            str += String.fromCharCode(b);
        }
        return str;
    }

    fastgstr(): string | null {
        if (this.data[this.pos] === 0) {
            this.pos++;
            return null;
        } else {
            return this.gjstr();
        }
    }

    gjstr2(): string {
        const version: number = this.#view.getUint8(this.pos++);
        if (version !== 0) {
            throw new Error();
        }
        return this.gjstr();
    }

    gSmart1or2(): number {
        return this.#view.getUint8(this.pos) < 128 ? this.g1() : this.g2() - 32768;
    }

    gSmart1or2s(): number {
        return this.#view.getUint8(this.pos) < 128 ? this.g1() - 64 : this.g2s() - 49152;
    }

    gSmart2or4(): number {
        return this.#view.getUint8(this.pos) >= 128 ? this.g4() & 0x7fffffff : this.g2();
    }

    gSmart2or4null(): number {
        if (this.#view.getUint8(this.pos) >= 128) {
            return this.g4() & 0x7fffffff;
        } else {
            const val: number = this.g2();
            return val === 32767 ? -1 : val;
        }
    }

    p1(value: number): void {
        this.#view.setUint8(this.pos++, value);
    }

    p2(value: number): void {
        this.#view.setUint16(this.pos, value);
        this.pos += 2;
    }

    p3(value: number): void {
        this.#view.setUint8(this.pos++, value >> 16);
        this.#view.setUint16(this.pos, value);
        this.pos += 2;
    }

    p4(value: number): void {
        this.#view.setInt32(this.pos, value);
        this.pos += 4;
    }

    p8(value: bigint): void {
        this.#view.setBigInt64(this.pos, value);
        this.pos += 8;
    }

    pjstr(str: string, terminator: number = 0): void {
        const length: number = str.length;
        for (let i: number = 0; i < length; i++) {
            this.#view.setUint8(this.pos++, str.charCodeAt(i));
        }
        this.#view.setUint8(this.pos++, terminator);
    }

    pjstr2(str: string): void {
        this.p1(0);
        this.pjstr(str);
    }

    pdata(src: Uint8Array, off: number, len: number): void {
        this.#data.set(src.subarray(off, off + len), this.pos);
        this.pos += len;
    }

    pSmart1or2(value: number): void {
        if (value < 128) {
            this.p1(value);
        } else {
            this.p2(value + 32768);
        }
    }

    pSmart1or2s(value: number): void {
        if (value < -64 || value >= 64) {
            this.p2(value + 49152);
        } else {
            this.p1(value + 64);
        }
    }

    pIsaac1or2(value: number): void {
        if (value < 128) {
            this.p1(value);
        } else {
            this.p1((value >> 8) + 128);
            this.p1(value);
        }
    }

    pSmart2or4(value: number): void {
        if (value < 32768) {
            this.p2(value);
        } else {
            this.p4(value | 0x80000000);
        }
    }

    pSmart2or4null(value: number): void {
        if (value === -1) {
            this.p2(32767);
        } else if (value < 32768) {
            this.p2(value);
        } else {
            this.p4(value | 0x80000000);
        }
    }

    psize4(size: number): void {
        this.#view.setUint32(this.pos - size - 4, size);
    }

    psize2(size: number): void {
        this.#view.setUint16(this.pos - size - 2, size);
    }

    psize1(size: number): void {
        this.#view.setUint8(this.pos - size - 1, size);
    }
}
