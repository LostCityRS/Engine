use crate::game::{Entity, Loc, Npc, Obj, PathingEntity, World};

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

    pub fn enter(&self, entity: impl PathingEntity) {
        entity.enter(self);
    }

    pub fn leave(&self, entity: impl PathingEntity) {
        entity.leave(self);
    }

    pub fn add_npc(&self, mut npc: Npc) {

    }

    pub fn del_npc(&self, npc: Npc) {

    }

    pub fn add_static_obj(&mut self, obj: Obj) {
        self.total_objs += 1;
    }

    pub fn add_static_loc(&mut self, loc: Loc) {
        self.total_locs += 1;
    }
}