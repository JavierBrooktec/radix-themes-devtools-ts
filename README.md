# radix-themes-devtools

Monorepo for [`radix-themes-devtools`](./packages/radix-themes-devtools) — a [TanStack Devtools](https://tanstack.com/devtools/latest) plugin for [Radix UI Themes](https://www.radix-ui.com/themes).

📦 **[→ Package docs & usage](./packages/radix-themes-devtools/README.md)**

---

## Structure

```
radix-themes-devtools/
├── packages/
│   └── radix-themes-devtools/   ← the npm package
└── apps/
    └── playground/              ← dev playground (Vite + TanStack Router)
```

## Development

**Requirements:** Node ≥ 20, pnpm ≥ 9

```bash
pnpm install
pnpm dev        # starts the playground at http://localhost:5173
pnpm build      # builds all packages
pnpm typecheck  # type-checks all packages
```

## Contributing

Issues and PRs are welcome. Please open an issue first for significant changes.

## License

MIT © [Javier Pérez](https://github.com/JavierBrooktec)
