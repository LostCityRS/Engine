use crate::game::{EntityBase, EntityLifeCycle};
use crate::game::pathing_entity::PathingEntity;
use crate::map::Zone;

pub struct Npc {
    pub base: EntityBase,
    pub ctype: u16
}

impl PathingEntity for Npc {
    fn enter(self, zone: &Zone) {
        zone.add_npc(self);
    }

    fn leave(self, zone: &Zone) {
        zone.del_npc(self);
    }
}

impl Npc {
    pub fn new(y: u8, x: i32, z: i32, width: u8, length: u8, lifecycle: EntityLifeCycle, ctype: u16) -> Npc {
        return Npc {
            base: EntityBase::new(y, x, z, width, length, lifecycle),
            ctype
        }
    }
}
