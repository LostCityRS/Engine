use std::cmp;
use std::collections::HashMap;
use std::rc::Rc;
use crate::io::Packet;

#[derive(Debug, Clone)]
pub struct ScriptFile {
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

pub struct ScriptProvider {
    scripts: Vec<Rc<ScriptFile>>,
    // map of name to index
    scripts_by_name: HashMap<String, usize>
}

impl ScriptProvider {
    pub fn load(path: &str) -> ScriptProvider {
        let mut dat = Packet::load(format!("{}/script.dat", path));
        let mut idx = Packet::load(format!("{}/script.idx", path));

        // let start = std::time::Instant::now();

        let count = dat.g2();
        idx.pos = 2;
        let build = dat.g4s();

        // println!("Loading {} scripts, compiled with compiler build {}", count, build);

        let mut provider = ScriptProvider {
            scripts: Vec::with_capacity(count as usize),
            scripts_by_name: HashMap::new()
        };

        for id in 0..count as usize {
            let length = idx.g2();
            if length == 0 {
                continue;
            }

            let start = dat.pos;
            let end = start + length as usize;

            let script = ScriptFile::decode(&mut dat, length);
            provider.scripts_by_name.insert(script.name.clone(), id);
            provider.scripts.push(Rc::new(script));

            if dat.pos > end {
                panic!("Script {} has read past end", id);
            }

            dat.pos = end;
        }

        // println!("Loaded {} scripts in {:?}", count, start.elapsed());

        provider
    }

    fn get(&self, id: usize) -> Rc<ScriptFile> {
        Rc::clone(&self.scripts[id])
    }

    pub fn get_by_name(&self, name: &str) -> Option<Rc<ScriptFile>> {
        if let Some(id) = self.scripts_by_name.get(name) {
            Some(self.get(*id))
        } else {
            None
        }
    }
}

struct GoSubFrame {
    script: Rc<ScriptFile>,
    pc: i32,
    int_locals: Vec<i32>,
    string_locals: Vec<String>,
}

pub struct ScriptState {
    script: Rc<ScriptFile>,
    execution_state: i32,
    pc: i32,
    pub opcount: i64,
    frames: Vec<GoSubFrame>,
    fp: usize,
    int_stack: Vec<i32>,
    isp: usize,
    string_stack: Vec<String>,
    ssp: usize,
    int_locals: Vec<i32>,
    string_locals: Vec<String>,
}

impl ScriptState {
    pub fn new_with_args(script: Rc<ScriptFile>, int_args: Vec<i32>, string_args: Vec<String>) -> ScriptState {
        let mut int_locals = vec![0; script.int_locals as usize];
        let mut string_locals = vec![String::new(); script.string_locals as usize];

        for i in 0..int_args.len() {
            int_locals[i] = int_args[i];
        }

        for i in 0..string_args.len() {
            string_locals[i] = string_args[i].clone();
        }

        ScriptState {
            script,
            execution_state: 0,
            pc: -1,
            opcount: 0,
            frames: Vec::with_capacity(50),
            fp: 0,
            int_stack: vec![0; 1000],
            isp: 0,
            string_stack: vec![String::new(); 1000],
            ssp: 0,
            int_locals,
            string_locals
        }
    }

    #[inline(always)]
    fn push_frame(&mut self, new_script: Rc<ScriptFile>) {
        let int_arg_count = new_script.int_args as usize;
        let string_arg_count = new_script.string_args as usize;
        let int_local_count = new_script.int_locals as usize;
        let string_local_count = new_script.string_locals as usize;

        let frame = GoSubFrame {
            script: Rc::clone(&new_script),
            pc: self.pc,
            int_locals: std::mem::replace(&mut self.int_locals, vec![0; int_local_count]),
            string_locals: std::mem::replace(&mut self.string_locals, vec![String::new(); string_local_count]),
        };

        self.frames.push(frame);
        self.fp += 1;
        self.pc = -1;

        for i in (0..int_arg_count).rev() {
            let value = self.pop_int();
            self.int_locals[i] = value;
        }

        for i in (0..string_arg_count).rev() {
            let value = self.pop_string();
            self.string_locals[i] = value;
        }
    }

    #[inline(always)]
    fn pop_frame(&mut self) {
        let frame = self.frames.pop().unwrap();
        self.fp -= 1;
        self.script = frame.script;
        self.pc = frame.pc;
        self.int_locals = frame.int_locals;
        self.string_locals = frame.string_locals;
    }

    #[inline(always)]
    fn push_int(&mut self, value: i32) {
        self.int_stack[self.isp] = value;
        self.isp += 1;
    }

    #[inline(always)]
    pub fn pop_int(&mut self) -> i32 {
        self.isp -= 1;
        self.int_stack[self.isp]
    }

    #[inline(always)]
    fn int_operand(&self) -> i32 {
        self.script.int_operands[self.pc as usize]
    }

    #[inline(always)]
    fn push_string(&mut self, value: String) {
        self.string_stack[self.ssp] = value;
        self.ssp += 1;
    }

    #[inline(always)]
    fn pop_string(&mut self) -> String {
        self.ssp -= 1;
        self.string_stack[self.ssp].clone()
    }

    #[inline(always)]
    fn string_operand(&self) -> String {
        self.script.string_operands[self.pc as usize].clone()
    }

    pub fn execute(&mut self, provider: &ScriptProvider) {
        let start = std::time::Instant::now();
        while self.execution_state == 0 {
            self.pc += 1;
            let opcode = self.script.opcodes[self.pc as usize];

            // let start = std::time::Instant::now();

            // Core ops
            if opcode == 0 {
                // PUSH_CONSTANT_INT
                self.push_int(self.int_operand());
            } else if opcode == 3 {
                // PUSH_CONSTANT_STRING
                self.push_string(self.string_operand());
            } else if opcode == 6 {
                // BRANCH
                self.pc += self.int_operand();
            } else if opcode == 7 {
                // BRANCH_NOT
                let b = self.pop_int();
                let a = self.pop_int();
                if a != b {
                    self.pc += self.int_operand();
                }
            } else if opcode == 8 {
                // BRANCH_EQUALS
                let b = self.pop_int();
                let a = self.pop_int();
                if a == b {
                    self.pc += self.int_operand();
                }
            } else if opcode == 9 {
                // BRANCH_LESS_THAN
                let b = self.pop_int();
                let a = self.pop_int();
                if a < b {
                    self.pc += self.int_operand();
                }
            } else if opcode == 10 {
                // BRANCH_GREATER_THAN
                let b = self.pop_int();
                let a = self.pop_int();
                if a > b {
                    self.pc += self.int_operand();
                }
            } else if opcode == 21 {
                // RETURN
                if self.fp == 0 {
                    self.execution_state = 1;
                    break;
                }

                self.pop_frame();
            } else if opcode == 22 {
                // GOSUB
                let operand = self.pop_int();
                self.push_frame(provider.get(operand as usize));
            } else if opcode == 23 {
                // JUMP
                panic!("Not implemented");
            } else if opcode == 24 {
                // SWITCH
                panic!("Not implemented");
            } else if opcode == 31 {
                // BRANCH_LESS_THAN_OR_EQUALS
                let b = self.pop_int();
                let a = self.pop_int();
                if a <= b {
                    self.pc += self.int_operand();
                }
            } else if opcode == 32 {
                // BRANCH_GREATER_THAN_OR_EQUALS
                let b = self.pop_int();
                let a = self.pop_int();
                if a >= b {
                    self.pc += self.int_operand();
                }
            } else if opcode == 33 {
                // PUSH_INT_LOCAL
                let operand = self.int_operand();
                self.push_int(self.int_locals[operand as usize]);
            } else if opcode == 34 {
                // POP_INT_LOCAL
                let operand = self.int_operand();
                self.int_locals[operand as usize] = self.pop_int();
            } else if opcode == 35 {
                // PUSH_STRING_LOCAL
                let operand = self.int_operand();
                self.push_string(self.string_locals[operand as usize].clone());
            } else if opcode == 36 {
                // POP_STRING_LOCAL
                let operand = self.int_operand();
                self.string_locals[operand as usize] = self.pop_string();
            } else if opcode == 37 {
                // JOIN_STRING
                panic!("Not implemented");
            } else if opcode == 38 {
                // POP_INT_DISCARD
                self.isp -= 1;
            } else if opcode == 39 {
                // POP_STRING_DISCARD
                self.ssp -= 1;
            } else if opcode == 40 {
                // GOSUB_WITH_PARAMS
                let operand = self.int_operand();
                self.push_frame(provider.get(operand as usize));
            } else if opcode == 41 {
                // JUMP_WITH_PARAMS
                panic!("Not implemented");
            } else if opcode == 44 {
                // DEFINE_ARRAY
                panic!("Not implemented");
            } else if opcode == 45 {
                // PUSH_ARRAY_INT
                panic!("Not implemented");
            } else if opcode == 46 {
                // POP_ARRAY_INT
                panic!("Not implemented");
            }
            // String ops
            else if opcode == 4500 {
                // APPEND_NUM
                panic!("Not implemented");
            } else if opcode == 4501 {
                // APPEND
                panic!("Not implemented");
            } else if opcode == 4502 {
                // APPEND_SIGNNUM
                panic!("Not implemented");
            } else if opcode == 4503 {
                // LOWERCASE
                panic!("Not implemented");
            } else if opcode == 4504 {
                // FROMDATE
                panic!("Not implemented");
            } else if opcode == 4505 {
                // TEXT_GENDER
                panic!("Not implemented");
            } else if opcode == 4506 {
                // TOSTRING
                panic!("Not implemented");
            } else if opcode == 4507 {
                // COMPARE
                panic!("Not implemented");
            } else if opcode == 4508 {
                // PARAHEIGHT
                panic!("Not implemented");
            } else if opcode == 4509 {
                // PARAWIDTH
                panic!("Not implemented");
            } else if opcode == 4510 {
                // TEXT_SWITCH
                panic!("Not implemented");
            } else if opcode == 4511 {
                // ESCAPE
                panic!("Not implemented");
            } else if opcode == 4512 {
                // APPEND_CHAR
                panic!("Not implemented");
            } else if opcode == 4513 {
                // CHAR_ISPRINTABLE
                panic!("Not implemented");
            } else if opcode == 4514 {
                // CHAR_ISALPHANUMERIC
                panic!("Not implemented");
            } else if opcode == 4515 {
                // CHAR_ISALPHA
                panic!("Not implemented");
            } else if opcode == 4516 {
                // CHAR_ISNUMERIC
                panic!("Not implemented");
            } else if opcode == 4517 {
                // STRING_LENGTH
                panic!("Not implemented");
            } else if opcode == 4518 {
                // SUBSTRING
                panic!("Not implemented");
            } else if opcode == 4519 {
                // REMOVETAGS
                panic!("Not implemented");
            } else if opcode == 4520 {
                // STRING_INDEXOF_CHAR
                panic!("Not implemented");
            } else if opcode == 4521 {
                // STRING_INDEXOF_STRING
                panic!("Not implemented");
            } else if opcode == 4522 {
                // CHAR_TOLOWERCASE
                panic!("Not implemented");
            } else if opcode == 4523 {
                // CHAR_TOUPPERCASE
                panic!("Not implemented");
            } else if opcode == 4524 {
                // STRING_TOUPPERCASE
                panic!("Not implemented");
            } else if opcode == 4525 {
                // STRING_TOLOWERCASE
                panic!("Not implemented");
            } else if opcode == 4526 {
                // TOSTRING_LOCALISED
                panic!("Not implemented");
            } else if opcode == 4527 {
                // STRINGWIDTH
                panic!("Not implemented");
            }
            // Math ops
            else if opcode == 4600 {
                // ADD
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(a + b);
            } else if opcode == 4601 {
                // SUB
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(a - b);
            } else if opcode == 4602 {
                // MULTIPLY
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(a * b);
            } else if opcode == 4603 {
                // DIVIDE
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(a / b);
            } else if opcode == 4604 {
                // RANDOM
                panic!("Not implemented");
            } else if opcode == 4605 {
                // RANDOMINC
                panic!("Not implemented");
            } else if opcode == 4606 {
                // INTERPOLATE
                panic!("Not implemented");
            } else if opcode == 4607 {
                // ADDPERCENT
                panic!("Not implemented");
            } else if opcode == 4608 {
                // SETBIT
                panic!("Not implemented");
            } else if opcode == 4609 {
                // CLEARBIT
                panic!("Not implemented");
            } else if opcode == 4610 {
                // TESTBIT
                panic!("Not implemented");
            } else if opcode == 4611 {
                // MODULO
                panic!("Not implemented");
            } else if opcode == 4612 {
                // POW
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(a.pow(b as u32));
            } else if opcode == 4613 {
                // INVPOW
                panic!("Not implemented");
            } else if opcode == 4614 {
                // AND
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(a & b);
            } else if opcode == 4615 {
                // OR
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(a | b);
            } else if opcode == 4616 {
                // MIN
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(cmp::min(a, b));
            } else if opcode == 4617 {
                // MAX
                let b = self.pop_int();
                let a = self.pop_int();
                self.push_int(cmp::max(a, b));
            } else if opcode == 4618 {
                // SCALE
                panic!("Not implemented");
            } else if opcode == 4619 {
                // BITCOUNT
                panic!("Not implemented");
            } else if opcode == 4620 {
                // TOGGLEBIT
                panic!("Not implemented");
            } else if opcode == 4621 {
                // SETBIT_RANGE
                panic!("Not implemented");
            } else if opcode == 4622 {
                // CLEARBIT_RANGE
                panic!("Not implemented");
            } else if opcode == 4623 {
                // GETBIT_RANGE
                panic!("Not implemented");
            } else if opcode == 4624 {
                // SETBIT_RANGE_TOINT
                panic!("Not implemented");
            } else if opcode == 4625 {
                // SIN_DEG
                panic!("Not implemented");
            } else if opcode == 4626 {
                // COS_DEG
                panic!("Not implemented");
            } else if opcode == 4627 {
                // ATAN2_DEG
                panic!("Not implemented");
            } else if opcode == 4628 {
                // ABS
                let a = self.pop_int();
                self.push_int(a.abs());
            } else {
                panic!("Unknown opcode: {}", opcode);
            }

            // println!("op: {} took {:?}", opcode, start.elapsed());

            self.opcount += 1;
        }

        let end = start.elapsed();
        println!("script: {:?}", end);
    }
}
