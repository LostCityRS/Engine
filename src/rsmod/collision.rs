use std::collections::HashMap;
use crate::rsmod::CollisionFlag;

pub struct CollisionFlagMap {
    flags: HashMap<usize, [u32; CollisionFlagMap::ZONE_TILE_COUNT]>
}

impl CollisionFlagMap {
    const ZONE_TILE_COUNT: usize = 8 * 8;
    const TOTAL_ZONE_COUNT: usize = 256 * 256 * 4 * CollisionFlagMap::ZONE_TILE_COUNT;

    #[inline(always)]
    fn zone_index(x: i32, z: i32, y: u8) -> usize {
        return (((x >> 3) & 0x7ff) | (((z >> 3) & 0x7ff) << 11) | ((y as i32 & 0x3) << 22)) as usize;
    }

    #[inline(always)]
    fn tile_index(x: i32, z: i32) -> usize {
        return ((x & 0x7) | ((z & 0x7) << 3)) as u8 as usize;
    }

    pub fn new() -> CollisionFlagMap {
        return CollisionFlagMap {
            flags: HashMap::new()
        }
    }

    pub fn get(&self, x: i32, z: i32, y: u8) -> u32 {
        let tile_index: usize = CollisionFlagMap::tile_index(x, z);

        return match self.flags.get(&CollisionFlagMap::zone_index(x, z, y)) {
            None => CollisionFlag::Null as u32,
            Some(flags) => {
                if flags.len() > 0 {
                    flags[tile_index]
                } else {
                    CollisionFlag::Null as u32
                }
            }
        }
    }

    pub fn set(&mut self, x: i32, z: i32, y: u8, mask: u32) {
        let tile_index: usize = CollisionFlagMap::tile_index(x, z);

        self.allocate_if_absent(x, z, y);

        match self.flags.get_mut(&CollisionFlagMap::zone_index(x, z, y)) {
            None => {}
            Some(flags) => flags[tile_index] = mask
        }
    }

    pub fn add(&mut self, x: i32, z: i32, y: u8, mask: u32) {
        let tile_index: usize = CollisionFlagMap::tile_index(x, z);

        let mut current: u32 = CollisionFlag::Open as u32;

        match self.flags.get(&CollisionFlagMap::zone_index(x, z, y)) {
            None => {}
            Some(flags) => {
                if flags.len() > 0 {
                    current = flags[tile_index];
                }
            }
        }

        self.set(x, z, y, current | mask);
    }

    pub fn remove(&mut self, x: i32, z: i32, y: u8, mask: u32) {
        let tile_index: usize = CollisionFlagMap::tile_index(x, z);

        let mut current: u32 = CollisionFlag::Open as u32;

        match self.flags.get(&CollisionFlagMap::zone_index(x, z, y)) {
            None => {}
            Some(flags) => {
                if flags.len() > 0 {
                    current = flags[tile_index];
                }
            }
        }

        self.set(x, z, y, current & !mask);
    }

    pub fn allocate_if_absent(&mut self, x: i32, z: i32, y: u8) {
        let zone_index: usize = CollisionFlagMap::zone_index(x, z, y);

        match self.flags.get(&zone_index) {
            None => return,
            Some(flags) => {
                if flags.len() > 0 {
                    return;
                }
            }
        }

        self.flags.insert(zone_index, [CollisionFlag::Open as u32; CollisionFlagMap::ZONE_TILE_COUNT]);
    }

    pub fn isFlagged(&self, x: i32, z: i32, level: u8, masks: u32) -> bool {
        return (self.get(x, z, level) & masks) != CollisionFlag::Open as u32;
    }
}

#[cfg(test)]
mod tests {
    use crate::rsmod::{CollisionFlag, CollisionFlagMap};

    #[test]
    fn test() {
        assert_eq!(CollisionFlagMap::zone_index(0, 0, 0), 0);
    }

    #[test]
    fn test2() {
        let collision: CollisionFlagMap = CollisionFlagMap::new();
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Null as u32);
    }

    #[test]
    fn test3() {
        let mut collision: CollisionFlagMap = CollisionFlagMap::new();
        collision.allocate_if_absent(0, 0, 0);
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Open as u32);
    }

    #[test]
    fn test4() {
        let mut collision: CollisionFlagMap = CollisionFlagMap::new();
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Null as u32);
        collision.allocate_if_absent(0, 0, 0);
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Open as u32);
    }

    #[test]
    fn test5() {
        let mut collision: CollisionFlagMap = CollisionFlagMap::new();
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Null as u32);

        collision.allocate_if_absent(0, 0, 0);
        collision.allocate_if_absent(0, 0, 0);
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Open as u32);

        collision.add(1, 1, 0, CollisionFlag::Loc as u32);
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Open as u32);
        assert_eq!(collision.get(1, 1, 0), CollisionFlag::Loc as u32);

        collision.remove(1, 1, 0, CollisionFlag::Loc as u32);
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Open as u32);
        assert_eq!(collision.get(1, 1, 0), CollisionFlag::Open as u32);

        collision.add(1, 1, 0, CollisionFlag::Roof as u32);
        assert_eq!(collision.get(0, 0, 0), CollisionFlag::Open as u32);
        assert_eq!(collision.get(1, 1, 0), CollisionFlag::Roof as u32);
    }
}
