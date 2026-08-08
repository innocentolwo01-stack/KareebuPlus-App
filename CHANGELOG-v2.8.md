# Kareebu+ Premium v2.8 — Dynamic Ride/Boda Vehicle System

## Ride/Boda mode state
- Added an explicit `VehicleMode` state with `RIDE` and `BODA`.
- Ride mode maps to backend `vehicle_type: CAR`.
- Boda mode maps to backend `vehicle_type: MOTORCYCLE`.
- Selecting Rides or Boda on Home, Global Search, Where To, or Choose Vehicle keeps the mode and ride selection synchronized.

## Dynamic map representation
- Added reusable car/motorbike map marker visuals.
- Route/selection maps now show nearby vehicles matching the selected mode.
- Switching Ride ↔ Boda immediately switches all vehicle markers on the map.
- The driver/on-trip map uses an animated marker with heading/rotation.

## GPS updates
- Added `useAnimatedVehicle()` for smooth latitude/longitude updates.
- Android uses `animateMarkerToCoordinate`; iOS uses `AnimatedRegion.timing`.
- Heading is normalized and applied to marker rotation.
- Prototype screens include a simulated GPS stream along the route for emulator testing.
- Added `subscribeToVehicleGps()` as the production WebSocket adapter shape.

## Dispatch
- Added a typed frontend dispatch payload builder.
- Added backend dispatch pseudocode that filters available drivers by `CAR` vs `MOTORCYCLE`, distance, and availability before offering the job in small waves.
