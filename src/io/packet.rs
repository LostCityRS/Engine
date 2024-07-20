#[derive(Debug, Clone)]
pub struct Packet {
    data: Vec<u8>,
    pub pos: usize,
    pub bit_pos: usize
}

impl Packet {
    pub fn alloc(size: usize) -> Packet {
        Packet {
            data: vec![0; size],
            pos: 0,
            bit_pos: 0
        }
    }

    pub fn from(data: Vec<u8>) -> Packet {
        Packet {
            data,
            pos: 0,
            bit_pos: 0
        }
    }

    pub fn load(path: String) -> Packet {
        let data = std::fs::read(path).unwrap();
        Packet::from(data)
    }

    pub fn avail(&self) -> i32 {
        return (self.len() - self.pos) as i32;
    }

    #[inline(always)]
    pub fn len(&self) -> usize {
        self.data.len()
    }

    #[inline(always)]
    pub fn g1(&mut self) -> u8 {
        self.pos += 1;
        self.data[self.pos - 1]
    }

    #[inline(always)]
    pub fn g1s(&mut self) -> i8 {
        self.pos += 1;
        self.data[self.pos - 1] as i8
    }

    #[inline(always)]
    pub fn g2(&mut self) -> u16 {
        self.pos += 2;
        (self.data[self.pos - 2] as u16) << 8
            | (self.data[self.pos - 1] as u16)
    }

    #[inline(always)]
    pub fn g2s(&mut self) -> i16 {
        self.pos += 2;
        (self.data[self.pos - 2] as i16) << 8
            | (self.data[self.pos - 1] as i16)
    }

    #[inline(always)]
    pub fn g3(&mut self) -> u32 {
        self.pos += 3;
        (self.data[self.pos - 3] as u32) << 16
            | (self.data[self.pos - 2] as u32) << 8
            | (self.data[self.pos - 1] as u32)
    }

    // java ints are always signed (java 8 added unsigned)
    #[inline(always)]
    pub fn g4s(&mut self) -> i32 {
        self.pos += 4;
        (self.data[self.pos - 4] as i32) << 24
            | (self.data[self.pos - 3] as i32) << 16
            | (self.data[self.pos - 2] as i32) << 8
            | (self.data[self.pos - 1] as i32)
    }

    // java longs are always signed (java 8 added unsigned)
    #[inline(always)]
    pub fn g8s(&mut self) -> i64 {
        self.pos += 8;
        (self.data[self.pos - 8] as i64) << 56
            | (self.data[self.pos - 7] as i64) << 48
            | (self.data[self.pos - 6] as i64) << 40
            | (self.data[self.pos - 5] as i64) << 32
            | (self.data[self.pos - 4] as i64) << 24
            | (self.data[self.pos - 3] as i64) << 16
            | (self.data[self.pos - 2] as i64) << 8
            | (self.data[self.pos - 1] as i64)
    }

    #[inline(always)]
    pub fn gjstr(&mut self) -> String {
        // read ASCII until \0
        let mut length = self.pos;
        while self.data[length] != 0 {
            length += 1;
        }

        let str = std::str::from_utf8(&self.data[self.pos..length]).unwrap();
        self.pos = length + 1;
        str.to_string()
    }

    #[inline(always)]
    pub fn gjstr_old(&mut self) -> String {
        // read ASCII until \n
        let mut length = self.pos;
        while self.data[length] != 10 {
            length += 1;
        }

        let str = std::str::from_utf8(&self.data[self.pos..length]).unwrap();
        self.pos = length + 1;
        str.to_string()
    }

    pub fn gsmart(&mut self) -> i32 {
        return if self.data[self.pos] < 0x80 { self.g1() as i32 } else { (self.g2() - 0x8000) as i32 };
    }

    #[inline(always)]
    pub fn bits(&mut self) {
        self.bit_pos = self.pos * 8;
    }

    #[inline(always)]
    pub fn bytes(&mut self) {
        self.pos = (self.bit_pos + 7) / 8;
    }

    #[inline(always)]
    pub fn pbit(&mut self, mut n: usize, val: u64) {
        let pos = self.bit_pos;
        self.bit_pos += n;

        let mut byte_pos = pos / 8;
        let mut remaining = 8 - (pos & 7);

        while n > remaining {
            let shift = (1 << remaining) - 1;
            let byte = self.data[byte_pos] as u64;

            self.data[byte_pos] = ((byte & !shift) | ((val >> (n - remaining)) & shift)) as u8;
            byte_pos += 1;

            n -= remaining;
            remaining = 8;
        }

        let shift = (1 << n) - 1;
        let byte = self.data[byte_pos] as u64;

        let r = remaining - n;
        self.data[byte_pos] = ((byte & (!shift << r)) | ((val & shift) << r)) as u8;
    }
}
