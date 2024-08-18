#[derive(Debug, Clone)]
pub struct Isaac {
    rsl: Vec<u32>,
    mem: Vec<u32>,
    count: i32,
    a: i32,
    b: i32,
    c: i32,
}

impl Isaac {
    pub fn new(seed: Vec<u32>) -> Self {
        let mut isaac = Isaac {
            rsl: vec![0; 256],
            mem: vec![0; 256],
            count: 0,
            a: 0,
            b: 0,
            c: 0,
        };

        for (i, &value) in seed.iter().enumerate() {
            isaac.rsl[i] = value;
        }

        isaac.init();
        isaac
    }

    pub fn init(&mut self) {
        let mut a: u32 = 0x9e3779b9;
        let mut b: u32 = 0x9e3779b9;
        let mut c: u32 = 0x9e3779b9;
        let mut d: u32 = 0x9e3779b9;
        let mut e: u32 = 0x9e3779b9;
        let mut f: u32 = 0x9e3779b9;
        let mut g: u32 = 0x9e3779b9;
        let mut h: u32 = 0x9e3779b9;

        for _ in 0..4 {
            a ^= b << 11;
            d = d.wrapping_add(a);
            b = b.wrapping_add(c);
            b ^= c >> 2;
            e = e.wrapping_add(b);
            c = c.wrapping_add(d);
            c ^= d << 8;
            f = f.wrapping_add(c);
            d = d.wrapping_add(e);
            d ^= e >> 16;
            g = g.wrapping_add(d);
            e = e.wrapping_add(f);
            e ^= f << 10;
            h = h.wrapping_add(e);
            f = f.wrapping_add(g);
            f ^= g >> 4;
            a = a.wrapping_add(f);
            g = g.wrapping_add(h);
            g ^= h << 8;
            b = b.wrapping_add(g);
            h = h.wrapping_add(a);
            h ^= a >> 9;
            c = c.wrapping_add(h);
            a = a.wrapping_add(b);
        }

        for i in (0..256).step_by(8) {
            a = a.wrapping_add(self.rsl[i]);
            b = b.wrapping_add(self.rsl[i + 1]);
            c = c.wrapping_add(self.rsl[i + 2]);
            d = d.wrapping_add(self.rsl[i + 3]);
            e = e.wrapping_add(self.rsl[i + 4]);
            f = f.wrapping_add(self.rsl[i + 5]);
            g = g.wrapping_add(self.rsl[i + 6]);
            h = h.wrapping_add(self.rsl[i + 7]);

            a ^= b << 11;
            d = d.wrapping_add(a);
            b = b.wrapping_add(c);
            b ^= c >> 2;
            e = e.wrapping_add(b);
            c = c.wrapping_add(d);
            c ^= d << 8;
            f = f.wrapping_add(c);
            d = d.wrapping_add(e);
            d ^= e >> 16;
            g = g.wrapping_add(d);
            e = e.wrapping_add(f);
            e ^= f << 10;
            h = h.wrapping_add(e);
            f = f.wrapping_add(g);
            f ^= g >> 4;
            a = a.wrapping_add(f);
            g = g.wrapping_add(h);
            g ^= h << 8;
            b = b.wrapping_add(g);
            h = h.wrapping_add(a);
            h ^= a >> 9;
            c = c.wrapping_add(h);
            a = a.wrapping_add(b);

            self.mem[i] = a;
            self.mem[i + 1] = b;
            self.mem[i + 2] = c;
            self.mem[i + 3] = d;
            self.mem[i + 4] = e;
            self.mem[i + 5] = f;
            self.mem[i + 6] = g;
            self.mem[i + 7] = h;
        }

        for i in (0..256).step_by(8) {
            a = a.wrapping_add(self.mem[i]);
            b = b.wrapping_add(self.mem[i + 1]);
            c = c.wrapping_add(self.mem[i + 2]);
            d = d.wrapping_add(self.mem[i + 3]);
            e = e.wrapping_add(self.mem[i + 4]);
            f = f.wrapping_add(self.mem[i + 5]);
            g = g.wrapping_add(self.mem[i + 6]);
            h = h.wrapping_add(self.mem[i + 7]);

            a ^= b << 11;
            d = d.wrapping_add(a);
            b = b.wrapping_add(c);
            b ^= c >> 2;
            e = e.wrapping_add(b);
            c = c.wrapping_add(d);
            c ^= d << 8;
            f = f.wrapping_add(c);
            d = d.wrapping_add(e);
            d ^= e >> 16;
            g = g.wrapping_add(d);
            e = e.wrapping_add(f);
            e ^= f << 10;
            h = h.wrapping_add(e);
            f = f.wrapping_add(g);
            f ^= g >> 4;
            a = a.wrapping_add(f);
            g = g.wrapping_add(h);
            g ^= h << 8;
            b = b.wrapping_add(g);
            h = h.wrapping_add(a);
            h ^= a >> 9;
            c = c.wrapping_add(h);
            a = a.wrapping_add(b);

            self.mem[i] = a;
            self.mem[i + 1] = b;
            self.mem[i + 2] = c;
            self.mem[i + 3] = d;
            self.mem[i + 4] = e;
            self.mem[i + 5] = f;
            self.mem[i + 6] = g;
            self.mem[i + 7] = h;
        }

        self.isaac();
        self.count = 256;
    }

    pub fn isaac(&mut self) {
        self.c = self.c.wrapping_add(1);
        self.b = self.b.wrapping_add(self.c);

        for i in 0..256 {
            let x = self.mem[i];

            match i & 3 {
                0 => self.a ^= self.a << 13,
                1 => self.a ^= self.a >> 6,
                2 => self.a ^= self.a << 2,
                3 => self.a ^= self.a >> 16,
                _ => (),
            }

            self.a = self.a.wrapping_add(self.mem[(i + 128) & 0xff] as i32);

            let y = self.mem[((x >> 2) & 0xff) as usize]
                .wrapping_add(self.a as u32)
                .wrapping_add(self.b as u32);
            self.mem[i] = y;
            self.b = self.mem[((y >> 8) & 0xff) as usize].wrapping_add(x) as i32;
            self.rsl[i] = self.b as u32;
        }
    }

    pub fn next_int(&mut self) -> i32 {
        if self.count == 0 {
            self.isaac();
            self.count = 255;
        } else {
            self.count -= 1;
        }
        self.rsl[self.count as usize] as i32
    }
}
