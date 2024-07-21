// https://gist.github.com/Z-Kris/90e687fd1502ed095804393f550ebfcc
pub struct ZoneGrid {
    grid: Vec<i32>
}

impl ZoneGrid {
    const GRID_SIZE: i32 = 2048;
    const INT_BITS: i32 = 5;
    const INT_BITS_FLAG: i32 = (1 << ZoneGrid::INT_BITS) - 1;

    pub const DEFAULT_GRID_SIZE: usize = (ZoneGrid::GRID_SIZE * (ZoneGrid::GRID_SIZE >> ZoneGrid::INT_BITS)) as usize;

    pub fn new(size: usize) -> ZoneGrid {
        return ZoneGrid {
            grid: vec![0; size]
        }
    }

    #[inline(always)]
    fn index(zone_x: i32, zone_y: i32) -> usize {
        return ((zone_x << ZoneGrid::INT_BITS) | (zone_y >> ZoneGrid::INT_BITS)) as usize;
    }

    pub fn flag(&mut self, zone_x: i32, zone_y: i32) {
        self.grid[ZoneGrid::index(zone_x, zone_y)] |= 1 << (zone_y & ZoneGrid::INT_BITS_FLAG);
    }

    pub fn unflag(&mut self, zone_x: i32, zone_y: i32) {
        self.grid[ZoneGrid::index(zone_x, zone_y)] &= !(1 << (zone_y & ZoneGrid::INT_BITS_FLAG));
    }

    pub fn flagged(&self, zone_x: i32, zone_y: i32, radius: i32) -> bool {
        let min_x: i32 = (zone_x - radius).max(0);
        let max_x: i32 = (zone_x + radius).min(ZoneGrid::GRID_SIZE - 1);
        let min_y: i32 = (zone_y - radius).max(0);
        let max_y: i32 = (zone_y + radius).min(ZoneGrid::GRID_SIZE - 1);
        let bits: i32 = ZoneGrid::INT_BITS_FLAG;
        let start_y: i32 = min_y & !bits;
        let end_y: i32 = max_y >> ZoneGrid::INT_BITS << ZoneGrid::INT_BITS;
        for x in min_x..=max_x {
            for y in (start_y..=end_y).step_by(32) {
                let index: usize = ZoneGrid::index(x, y);
                match self.grid.get(index) {
                    None => continue,
                    Some(line) => {
                        let mut trailing_trimmed: i32 = *line;
                        if y + bits > max_y {
                            trailing_trimmed &= (1 << (max_y - y + 1)) - 1;
                        }
                        let mut leading_trimmed: i32 = trailing_trimmed;
                        if y < min_y {
                            leading_trimmed >>= min_y - y;
                        }
                        if leading_trimmed != 0 {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}

#[cfg(test)]
mod tests {
    use crate::map::zone_grid::ZoneGrid;

    #[test]
    fn test1() {
        let mut grid: ZoneGrid = ZoneGrid::new(ZoneGrid::DEFAULT_GRID_SIZE);
        assert_eq!(grid.flagged(402, 402, 5), false);
        grid.flag(402, 402);
        assert_eq!(grid.flagged(402, 402, 5), true);
        grid.unflag(402, 402);
        assert_eq!(grid.flagged(402, 402, 5), false);
    }
}
