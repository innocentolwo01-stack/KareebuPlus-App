# Kareebu+ V7 Clean Baseline

The app is no longer treated as a chain of V6.9 → V6.11 → V6.15 → V6.19 patches.

The accepted project state is the **Kareebu+ V7 baseline** recorded in:

- `kareebu-baseline.json`
- `scripts/baseline/validate-contracts.mjs`

## Hard gates

Future changes are accepted when they pass:

1. `npm run typecheck`
2. `npm run validate`
3. `git diff --check`
4. Expo Doctor when dependencies/native config change
5. Android Metro export for release-quality patches

## Validator rule

Validators test durable product contracts:
- persistent navigation exists
- every route has a renderer
- category pages use the shared marketplace chrome
- category tiles use branded semantic art
- Food retains search/listing/filter surfaces
- Boda uses motorcycle semantics

Validators must not fail merely because:
- a style variable was renamed
- an icon moved from 38px to 52px
- a component moved to another file
- a versioned style name changed
- an obsolete literal JSX string disappeared

## Legacy validators

Old validators are archived in:
`scripts/baseline/legacy-scripts.json`

Run them only for comparison:
`npm run validate:legacy`

They are diagnostic only.

## Future patch rule

Future patches target V7 contracts, not old V6 hashes.

Exact source hashes may protect a truly destructive replacement, but may not
replace compiler, contract and runtime validation.

## Modularisation

New substantial functionality should live in its domain module rather than
making `src/screens.tsx` larger.

Preferred domains:
- `src/food`
- `src/marketplace`
- `src/ride`
- `src/navigation`
- `src/parity`
- future `src/wallet`, `src/account`, `src/activity`

Existing large files can be decomposed progressively without a big-bang rewrite.
