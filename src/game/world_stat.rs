#[repr(u8)]
pub enum WorldStat {
    Cycle,
    World,
    ClientsIn,
    Npcs,
    Players,
    Logouts,
    Logins,
    Zones,
    ClientsOut,
    Cleanup,
    BandwidthIn,
    BandwidthOut
}
