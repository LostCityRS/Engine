use std::collections::HashMap;
use crate::map::zone::Zone;
use crate::map::zone_grid::ZoneGrid;

pub struct ZoneMap {
    zones: HashMap<i32, Zone>,
    grids: HashMap<u8, ZoneGrid>
}

impl ZoneMap {
    pub fn new() -> ZoneMap {
        return ZoneMap {
            zones: HashMap::new(),
            grids: HashMap::new()
        }
    }

    #[inline(always)]
    pub fn zone_index(x: i32, z: i32, y: u8) -> i32 {
        return ((x >> 3) & 0x7ff) | (((z >> 3) & 0x7ff) << 11) | ((y as i32 & 0x3) << 22);
    }

    #[inline(always)]
    pub fn x(packed: i32) -> i32 {
        return (packed & 0x7ff) << 3;
    }

    #[inline(always)]
    pub fn y(packed: i32) -> u8 {
        return (packed >> 22) as u8;
    }

    #[inline(always)]
    pub fn z(packed: i32) -> i32 {
        return ((packed >> 11) & 0x7ff) << 3;
    }

    pub fn zone(&mut self, x: i32, z: i32, y: u8) -> &mut Zone {
        let index: i32 = ZoneMap::zone_index(x, z, y);
        return self.zones.entry(index).or_insert(Zone::new(index));
    }

    pub fn zone_by_index(&mut self, index: i32) -> &mut Zone {
        return self.zones.entry(index).or_insert(Zone::new(index));
    }

    pub fn grid(&mut self, y: u8) -> &mut ZoneGrid {
        return self.grids.entry(y).or_insert(ZoneGrid::new(ZoneGrid::DEFAULT_GRID_SIZE));
    }

    pub fn zone_count(&self) -> i32 {
        return self.zones.len() as i32;
    }

    pub fn loc_count(&self) -> i32 {
        let mut count: i32 = 0;
        for zone in self.zones.values() {
            count += zone.total_locs;
        }
        return count;
    }

    pub fn obj_count(&self) -> i32 {
        let mut count: i32 = 0;
        for zone in self.zones.values() {
            count += zone.total_objs;
        }
        return count;
    }
}

#[cfg(test)]
mod tests {
    use crate::map::ZoneMap;

    #[test]
    fn test() {
        let mut zone_map: ZoneMap = ZoneMap::new();
        assert_eq!(zone_map.zone(0, 0, 0).index, 0);
    }
}
