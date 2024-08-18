use criterion::*;
use lostcity::io::{Isaac, Packet};

fn worst_case(packet: &mut Packet) {
    packet.bit_pos = 0;
    for _ in 0..45714 {
        // result: 201 147 38 76 153 50 100 over and over
        packet.pbit(7, 100);
    }
}

fn isaac_next(isaac: &mut Isaac) {
    for _ in 0..1000000 {
        isaac.next_int();
    }
}

pub fn criterion_benchmark_packet(c: &mut Criterion) {
    let packet = Packet::alloc(40000);

    c.bench_function("pbit", move |b| {
        b.iter_batched(|| packet.clone(), |mut packet| worst_case(&mut packet), BatchSize::SmallInput)
    });
}

pub fn criterion_benchmark_isaac(c: &mut Criterion) {
    let mut isaac = Isaac::new(vec![0, 0, 0, 0]);

    c.bench_function("isaac", move |b| {
        b.iter_batched(|| isaac.clone(), |mut isaac| isaac_next(&mut isaac), BatchSize::SmallInput)
    });
}

criterion_group!(benches, criterion_benchmark_packet, criterion_benchmark_isaac);
criterion_main!(benches);
