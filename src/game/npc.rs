use crate::game::{EntityBase, EntityLifeCycle};
use crate::game::pathing_entity::PathingEntity;

pub struct Npc {
    pub base: EntityBase,
    pub nid: i32,
    pub ctype: u16
}

impl PathingEntity for Npc {
}

impl Npc {
    pub fn new(y: u8, x: i32, z: i32, width: u8, length: u8, lifecycle: EntityLifeCycle, nid: i32, ctype: u16) -> Npc {
        return Npc {
            base: EntityBase::new(y, x, z, width, length, lifecycle),
            nid,
            ctype
        }
    }
}
