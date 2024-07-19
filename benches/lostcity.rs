use criterion::*;
use lostcity::io::packet::Packet;

fn worst_case(packet: &mut Packet) {
    for _ in 0..45714 {
        // result: 201 147 38 76 153 50 100 over and over
        packet.pbit(7, 100);
    }
}

pub fn criterion_benchmark(c: &mut Criterion) {
    let packet = Packet::alloc(40000);

    c.bench_function("pbit", move |b| {
        b.iter_batched(|| packet.clone(), |mut packet| worst_case(&mut packet), BatchSize::SmallInput)
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
