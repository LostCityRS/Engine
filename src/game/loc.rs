use crate::game::entity::EntityBase;
use crate::game::lifecycle::EntityLifeCycle;
use crate::game::non_pathing_entity::NonPathingEntity;

pub struct Loc {
    pub base: EntityBase,
    info: i32
}

impl NonPathingEntity for Loc {}

impl Loc {
    pub fn new(y: u8, x: i32, z: i32, width: u8, length: u8, lifecycle: EntityLifeCycle, ctype: u16, shape: u8, angle: u8) -> Loc {
        return Loc {
            base: EntityBase::new(y, x, z, width, length, lifecycle),
            // 16383, 31, 3
            info: (ctype as i32 & 0x3fff) | (shape as i32 & 0x1f) << 14 | (angle as i32 & 0x3) << 19
        }
    }

    #[inline(always)]
    pub fn ctype(&self) -> u16 {
        return (self.info & 0x3fff) as u16;
    }

    #[inline(always)]
    pub fn shape(&self) -> u8 {
        return ((self.info >> 14) & 0x1f) as u8;
    }

    #[inline(always)]
    pub fn angle(&self) -> u8 {
        return ((self.info >> 19) & 0x3) as u8;
    }
}
