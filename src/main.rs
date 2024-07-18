use std::collections::HashMap;

struct Packet {
    data: Vec<u8>,
    pos: usize,
    bit_pos: usize
}

impl Packet {
    fn new(size: usize) -> Packet {
        Packet {
            data: vec![0; size],
            pos: 0,
            bit_pos: 0
        }
    }

    fn from(data: Vec<u8>) -> Packet {
        Packet {
            data,
            pos: 0,
            bit_pos: 0
        }
    }

    fn load(path: String) -> Packet {
        let data = std::fs::read(path).unwrap();
        Packet::from(data)
    }

    fn len(&self) -> usize {
        self.data.len()
    }

    fn g1(&mut self) -> u8 {
        self.pos += 1;
        self.data[self.pos - 1]
    }

    fn g1s(&mut self) -> i8 {
        self.pos += 1;
        self.data[self.pos - 1] as i8
    }

    fn g2(&mut self) -> u16 {
        self.pos += 2;
        (self.data[self.pos - 2] as u16) << 8
            | (self.data[self.pos - 1] as u16)
    }

    fn g2s(&mut self) -> i16 {
        self.pos += 2;
        (self.data[self.pos - 2] as i16) << 8
            | (self.data[self.pos - 1] as i16)
    }

    fn g3(&mut self) -> u32 {
        self.pos += 3;
        (self.data[self.pos - 3] as u32) << 16
            | (self.data[self.pos - 2] as u32) << 8
            | (self.data[self.pos - 1] as u32)
    }

    // java ints are always signed (java 8 added unsigned)
    fn g4s(&mut self) -> i32 {
        self.pos += 4;
        (self.data[self.pos - 4] as i32) << 24
            | (self.data[self.pos - 3] as i32) << 16
            | (self.data[self.pos - 2] as i32) << 8
            | (self.data[self.pos - 1] as i32)
    }

    // java longs are always signed (java 8 added unsigned)
    fn g8s(&mut self) -> i64 {
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

    fn gjstr(&mut self) -> String {
        // read ASCII until \0
        let mut length = self.pos;
        while self.data[length] != 0 {
            length += 1;
        }

        let str = std::str::from_utf8(&self.data[self.pos..length]).unwrap();
        self.pos = length + 1;
        str.to_string()
    }

    fn gjstr_old(&mut self) -> String {
        // read ASCII until \n
        let mut length = self.pos;
        while self.data[length] != 10 {
            length += 1;
        }

        let str = std::str::from_utf8(&self.data[self.pos..length]).unwrap();
        self.pos = length + 1;
        str.to_string()
    }
}

struct ScriptFile {
    id: i32,
    int_locals: u16,
    string_locals: u16,
    int_args: u16,
    string_args: u16,
    // todo: switch table
    opcodes: Vec<u16>,
    int_operands: Vec<i32>,
    string_operands: Vec<String>,

    name: String,
    path: String,
    key: i32,
    parameters: Vec<u8>,
    line_number_table: Vec<(i32, i32)>
}

impl ScriptFile {
    fn decode(dat: &mut Packet, length: u16) -> ScriptFile {
        let start = dat.pos;
        let end = dat.pos + length as usize;

        dat.pos = end - 2;
        let trailer_len = dat.g2() as usize;
        let trailer_pos = end - trailer_len - 2 - 12;
        dat.pos = trailer_pos;

        let instructions = dat.g4s();
        let int_locals = dat.g2();
        let string_locals = dat.g2();
        let int_args = dat.g2();
        let string_args = dat.g2();

        let switches = dat.g1();
        if switches > 0 {
            for _ in 0..switches {
                let count = dat.g2();

                for _ in 0..count {
                    dat.g4s();
                    dat.g4s();
                }
            }
        }

        dat.pos = start;

        // debug
        let name = dat.gjstr();
        let path = dat.gjstr();
        let key = dat.g4s();

        let parameter_count = dat.g1();
        let mut parameters = vec![0; parameter_count as usize];
        for i in 0..parameter_count as usize {
            parameters[i] = dat.g1();
        }

        let line_number_count = dat.g2();
        let mut line_number_table = vec![(0, 0); line_number_count as usize];
        for _ in 0..line_number_count {
            line_number_table.push((dat.g4s(), dat.g4s()));
        }

        // runtime
        let mut opcodes = vec![0; instructions as usize];
        let mut int_operands = vec![0; instructions as usize];
        let mut string_operands = vec![String::new(); instructions as usize];

        let mut pc = 0;
        while trailer_pos > dat.pos {
            let opcode = dat.g2();

            if opcode == 3 {
                string_operands[pc] = dat.gjstr();
            } else if opcode >= 100 || opcode == 21 || opcode == 38 || opcode == 39 || opcode == 22 || opcode == 23 {
                int_operands[pc] = dat.g1() as i32;
            } else {
                int_operands[pc] = dat.g4s();
            }

            opcodes[pc] = opcode;
            pc += 1;
        }

        ScriptFile {
            id: 0,
            int_locals,
            string_locals,
            int_args,
            string_args,
            opcodes,
            int_operands,
            string_operands,
            name,
            path,
            key,
            parameters,
            line_number_table
        }
    }
}

struct ScriptProvider {
    scripts: Vec<ScriptFile>,
    scripts_by_name: HashMap<String, ScriptFile>,
    scripts_by_key: HashMap<i32, ScriptFile>
}

impl ScriptProvider {
    fn load(path: &str) -> ScriptProvider {
        let mut dat = Packet::load(format!("{}/script.dat", path));
        let mut idx = Packet::load(format!("{}/script.idx", path));

        let start = std::time::Instant::now();

        let count = dat.g2();
        idx.pos = 2;
        let build = dat.g4s();

        // println!("Loading {} scripts, compiled with compiler build {}", count, build);

        let mut provider = ScriptProvider {
            scripts: Vec::new(),
            scripts_by_name: HashMap::new(),
            scripts_by_key: HashMap::new()
        };

        for id in 0..count {
            let length = idx.g2();
            if length == 0 {
                continue;
            }

            let start = dat.pos;
            let end = start + length as usize;

            ScriptFile::decode(&mut dat, length);

            if dat.pos > end {
                panic!("Script {} has read past end", id);
            }

            dat.pos = end;
        }

        println!("Loaded {} scripts in {:?}", count, start.elapsed());

        provider
    }
}

fn main() {
    ScriptProvider::load("data/pack/server");
}
