#[repr(u8)]
pub enum LocShape {
    WallStraight = 0,
    WallDiagonalCorner = 1,
    WallL = 2,
    WallSquareCorner = 3,
    WalldecorStraightNooffset = 4,
    WalldecorStraightOffset = 5,
    WalldecorDiagonalOffset = 6,
    WalldecorDiagonalNooffset = 7,
    WalldecorDiagonalBoth = 8,
    WallDiagonal = 9,
    CentrepieceStraight = 10,
    CentrepieceDiagonal = 11,
    RoofStraight = 12,
    RoofDiagonalWithRoofedge = 13,
    RoofDiagonal = 14,
    RoofLConcave = 15,
    RoofLConvex = 16,
    RoofFlat = 17,
    RoofedgeStraight = 18,
    RoofedgeDiagonalCorner = 19,
    RoofedgeL = 20,
    RoofedgeSquareCorner = 21,
    GroundDecor = 22
}

impl TryFrom<u8> for LocShape {
    type Error = &'static str;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(LocShape::WallStraight),
            1 => Ok(LocShape::WallDiagonalCorner),
            2 => Ok(LocShape::WallL),
            3 => Ok(LocShape::WallSquareCorner),
            4 => Ok(LocShape::WalldecorStraightNooffset),
            5 => Ok(LocShape::WalldecorStraightOffset),
            6 => Ok(LocShape::WalldecorDiagonalOffset),
            7 => Ok(LocShape::WalldecorDiagonalNooffset),
            8 => Ok(LocShape::WalldecorDiagonalBoth),
            9 => Ok(LocShape::WallDiagonal),
            10 => Ok(LocShape::CentrepieceStraight),
            11 => Ok(LocShape::CentrepieceDiagonal),
            12 => Ok(LocShape::RoofStraight),
            13 => Ok(LocShape::RoofDiagonalWithRoofedge),
            14 => Ok(LocShape::RoofDiagonal),
            15 => Ok(LocShape::RoofLConcave),
            16 => Ok(LocShape::RoofLConvex),
            17 => Ok(LocShape::RoofFlat),
            18 => Ok(LocShape::RoofedgeStraight),
            19 => Ok(LocShape::RoofedgeDiagonalCorner),
            20 => Ok(LocShape::RoofedgeL),
            21 => Ok(LocShape::RoofedgeSquareCorner),
            22 => Ok(LocShape::GroundDecor),
            _ => Err("Invalid loc shape value.")
        }
    }
}