pub struct Zone {
    pub index: i32,
    pub total_locs: i32,
    pub total_objs: i32
}

impl Zone {
    pub fn new(index: i32) -> Zone {
        Zone {
            index,
            total_locs: 0,
            total_objs: 0
        }
    }

    pub fn add_static_obj(&mut self) {
        self.total_objs += 1;
    }

    pub fn add_static_loc(&mut self) {
        self.total_locs += 1;
    }
}