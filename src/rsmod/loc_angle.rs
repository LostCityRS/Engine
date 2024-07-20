#[repr(u8)]
pub enum LocAngle {
    West = 0,
    North = 1,
    East = 2,
    South = 3
}

impl TryFrom<u8> for LocAngle {
    type Error = &'static str;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(LocAngle::West),
            1 => Ok(LocAngle::North),
            2 => Ok(LocAngle::East),
            3 => Ok(LocAngle::South),
            _ => Err("Invalid loc angle value.")
        }
    }
}