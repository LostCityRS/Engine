## TODO

In TypeScript, we have these classes that are critical to the server behavior:

```
Packet
BZip2
Jagfile
CollisionMap
Zone, Zone Events
Script Loader, Runtime
World
Login
Network Encoder, Decoder, Handler
  Isaac
  RSA
Entity
  PathingEntity
    NpcEntity
    PlayerEntity
  LocEntity
  ObjEntity
Inventory
```

We need to translate them to be rust-appropriate and take advantage of idioms where possible. Some redesign needed.

We're not bothering with cache packing at this time. Copy-paste `data/pack/` to here from the TypeScript engine/packer.
