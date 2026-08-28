# Kareebu+ v3.8.1 — Activity TypeScript Fix

- Fixed the `ActivityScreen` prop mismatch for `HomeRecentActivityCompact`.
- The component accepts `go: (screen: Screen) => void`; Activity now passes `go={actions.go}` instead of the invalid `actions={actions}` prop.
- No runtime behaviour or native dependencies changed.
