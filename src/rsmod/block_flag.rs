#[repr(u8)]
pub enum BlockAccessFlag {
    North = 0x1,
    East = 0x2,
    South = 0x4,
    West = 0x8
}