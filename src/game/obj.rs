use crate::game::{EntityBase, EntityLifeCycle, Loc};
use crate::game::non_pathing_entity::NonPathingEntity;

pub struct Obj {
    pub base: EntityBase,
    pub info: i64,
    pub receiver: i32,
    pub reveal: i32
}

impl NonPathingEntity for Obj {}

impl Obj {
    pub fn new(y: u8, x: i32, z: i32, lifecycle: EntityLifeCycle, ctype: u16, count: i32) -> Obj {
        return Obj {
            base: EntityBase::new(y, x, z, 1, 1, lifecycle),
            info: (ctype as i64 & 0x3fff) | (count as i64 & 0x7fffffff) << 14,
            receiver: -1,
            reveal: -1
        }
    }

    #[inline(always)]
    pub fn ctype(&self) -> u16 {
        return (self.info & 0x3fff) as u16;
    }

    pub fn count(&self) -> i32 {
        return ((self.info >> 14) & 0x7fffffff) as i32;
    }
}