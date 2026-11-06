# Fig & Fennel: the finished course app

A full restaurant ordering app for **iOS and Android**, built with Expo in the free course
**[Build a full restaurant app with Expo from scratch](https://youtu.be/dRi0hSMB4r8)**. There's no backend: every
screen runs on a typed, in-memory data layer seeded with the design's own data, so the whole app is clickable end to
end, manager's console included.

This folder is the app at the end of chapter 26. Every earlier chapter is a tag (`chapter-01` … `chapter-26`); see
the [main README](../README.md#the-chapters).

## Run it

You need Node 22+, plus Xcode (Mac, for the iOS simulator) or Android Studio (for the Android emulator).

```bash
npm install
```

```bash
npx expo run:ios          # or: npx expo run:android
```

The first `run:*` builds a development app, which takes a few minutes. After that, `npx expo start` is enough.

Sign in with any email and password. The manager's console is under **Profile → Restaurant admin**.

## Checks

```bash
npx tsc --noEmit
```

```bash
npx expo lint
```

## Layout

```
src/app/          routes (Expo Router): the guest app, (tabs), admin/ (the console)
src/components/   the UI kit (ui/), home sections, account sheets, the admin kit, icons
src/store/        one Zustand store for the whole app: state, every action, the simulation clock
src/data/         types, the menu, content and seed data (from the design)
src/theme/        colour tokens (light and dark), typography, the theme provider
design/           the design prototype the app was built from (open the .html in a browser)
assets/           the app icon, the Android icon layers and the splash badge
tools/            build-icons.mjs: generates the Material Symbols glyphs the app uses
```

## Want the full-stack edition?

The same app with its own API, Firebase sign-in (email, Apple, Google), Stripe payments, ImageKit photo uploads and a
restaurant team with roles: **[get the full-stack source code](https://buymeacoffee.com/reactbd/e/595519)**.

## License

MIT. See [LICENSE](../LICENSE).
