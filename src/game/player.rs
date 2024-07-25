use crate::game::{EntityBase, EntityLifeCycle};
use crate::game::pathing_entity::PathingEntity;

pub struct Player {
    pub base: EntityBase,
    pub uid: i32
}

impl PathingEntity for Player {
}

impl Player {
    pub fn new(y: u8, x: i32, z: i32, width: u8, length: u8, lifecycle: EntityLifeCycle, uid: i32) -> Player {
        return Player {
            base: EntityBase::new(y, x, z, width, length, lifecycle),
            uid
        }
    }
}
