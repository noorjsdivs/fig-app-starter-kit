# The guide: from an empty folder to the finished app

This guide goes with the free course **[Build a full restaurant app with Expo from scratch](https://youtu.be/dRi0hSMB4r8)**.
Keep it open next to the video.

1. [What you need](#1-what-you-need)
2. [Get the starter kit](#2-get-the-starter-kit)
3. [Follow the course](#3-follow-the-course)
4. [Use the checkpoints](#4-use-the-checkpoints)
5. [Run the finished app](#5-run-the-finished-app)
6. [Troubleshooting](#6-troubleshooting)
7. [Going further: the full-stack edition](#7-going-further-the-full-stack-edition)

---

## 1. What you need

| | macOS | Windows / Linux |
| --- | --- | --- |
| **Node.js** | 22 LTS or newer, from [nodejs.org](https://nodejs.org) | same |
| **A code editor** | [VS Code](https://code.visualstudio.com) (the one in the video) | same |
| **iOS simulator** | **Xcode** from the Mac App Store. Open it once and install an iOS simulator when it asks | not available (iOS needs a Mac) |
| **Android emulator** | [Android Studio](https://developer.android.com/studio) with one virtual device (optional on a Mac) | **Android Studio** with one virtual device |
| **Git** | optional, for switching between chapter checkpoints | same |

Check them in a terminal:

```bash
node -v
```

```bash
xcodebuild -version      # macOS only
```

You **don't** need any accounts, keys or paid services. The app runs on local data, and the food photos load from
Unsplash, so keep the simulator online.

> **Expo Go is not used.** The app uses native modules such as blur, SVG and masked views, so the course builds a
> **development build** with `npx expo run:ios` or `npx expo run:android`. After the first build, `npx expo start` is
> enough.

## 2. Get the starter kit

Either download it (green **Code** button → **Download ZIP**, then unzip), or clone it:

```bash
git clone https://github.com/noorjsdivs/fig-app-starter-kit.git
```

Inside:

```
fig-app-starter-kit/
├── README.md        the overview, with links to every chapter
├── GUIDE.md         this guide
├── starter-pack/    what chapter 1 copies into your project
│   ├── design/      the interactive prototype (open the .html in a browser)
│   └── assets/      the app icon, the Android icon layers and the splash badge
└── app/             the finished app (the chapter tags hold every step in between)
```

To look at the design, open `starter-pack/design/fig-and-fennel.dc.html` in Chrome, Safari or Firefox. The screen index
is on the left and the phone is on the right. Every colour, font, icon and piece of data the app uses comes from this
file.

## 3. Follow the course

Build your own project **next to** the starter kit, not inside it. You'll copy two folders from `starter-pack/` in
chapter 1, and that's all you take from the kit. The rest you type.

### Chapter 1, step by step

1. Create the project and open it in VS Code:
   ```bash
   npx create-expo-app@latest fig-and-fennel --template default@sdk-58
   ```
   > The video types `--template default`. Adding **`@sdk-58`** gives you the same Expo SDK as the course, even after a
   > newer SDK comes out. Without it, `create-expo-app` creates whichever SDK is current, and some code may differ.
   ```bash
   cd fig-and-fennel
   ```
2. Clear out the template's examples (on Windows, delete these in the file explorer instead):
   ```bash
   rm -rf src/components src/hooks src/constants src/app/explore.tsx scripts
   ```
   Then remove the `"reset-project"` line from the `scripts` in `package.json`.
3. Remove the five packages the course doesn't use:
   ```bash
   npm uninstall @expo/ui expo-glass-effect expo-symbols expo-web-browser expo-device
   ```
4. Copy **`starter-pack/design`** and **`starter-pack/assets`** into your project's root folder. If it asks, replace
   the existing files. The template's own `assets/` folder can go.
5. Add the linters:
   ```bash
   npm install -D eslint eslint-config-expo prettier
   ```
6. Type the files from the video: `app.json`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`,
   `.prettierignore`, `src/app/_layout.tsx` and `src/app/index.tsx`.
7. Run it. The first build takes a few minutes:
   ```bash
   npx expo run:ios          # or: npx expo run:android
   ```

The checkpoint: the simulator shows **Fig & Fennel, fresh food, made easy** on a warm off-white screen.

### What each chapter installs

Most chapters only add code. These are the ones that also install something. Run the command when the chapter does.

| Chapter | Run |
| --- | --- |
| 1 · An empty folder | `npx create-expo-app@latest fig-and-fennel --template default@sdk-58`, then `npm uninstall @expo/ui expo-glass-effect expo-symbols expo-web-browser expo-device` and `npm install -D eslint eslint-config-expo prettier` |
| 2 · Design tokens, fonts and icons | `npx expo install @expo-google-fonts/outfit react-native-svg` and `npm install -D @material-symbols/svg-500` |
| 4 · One store for the whole app | `npm install zustand` |
| 5 · UI kit: text, glass and controls | `npx expo install expo-blur expo-linear-gradient expo-haptics` |
| 15 · Splash and onboarding | `npx expo install @react-native-masked-view/masked-view` |
| 26 · Typed routes, checks and Android | `npx expo start` (once, to generate the route types), then `npx tsc --noEmit`, `npx expo lint` and `npx expo run:android` |

> After installing a package with native code (SVG, blur, haptics, masked view), build again with
> `npx expo run:ios` or `npx expo run:android`. A reload isn't enough.

### Tips for typing along

- **Pause often.** Every file is shown in full. Long data files, like the menu in chapter 3, are shown a page at a
  time, so you can pause on each page.
- **Every chapter ends at a checkpoint that runs.** If yours doesn't, compare it with that chapter's code before moving
  on (see the next section).
- **Use `npx expo install`, not `npm install`, for Expo packages.** It picks the versions that match SDK 58.
- **Run the checks** whenever something looks off:
  ```bash
  npx tsc --noEmit
  ```
  ```bash
  npx expo lint
  ```

## 4. Use the checkpoints

Every chapter has a **tag**, `chapter-01` to `chapter-26`. A tag holds the `app/` folder exactly as it stands at the
end of that chapter. The starting point (only the starter pack) is the tag `starter-pack`.

All checkpoints share the course's final `package.json`, so one `npm install` works for every chapter.

**See a chapter's code or changes on GitHub.** Use the **Code** and **What changed** links in the
[chapter table](README.md#the-chapters). "What changed" shows every line the chapter added or edited, which is the
fastest way to find a typo.

**Download a chapter.** Open the [tags page](https://github.com/noorjsdivs/fig-app-starter-kit/tags) and click
**zip** under the chapter you want.

**Switch chapters with git:**

```bash
cd fig-app-starter-kit
git checkout chapter-12
```

```bash
cd app && npm install && npx expo run:ios
```

Back to the finished app:

```bash
git checkout main
```

**Compare with your own project.** In VS Code, right-click your file → **Select for Compare**, then right-click the
same file in the checkpoint → **Compare with Selected**.

**Start in the middle.** Copy a checkpoint's `app/` folder as your project, run `npm install`, and carry on from the
next chapter.

## 5. Run the finished app

```bash
cd fig-app-starter-kit/app
npm install
npx expo run:ios          # or: npx expo run:android
```

- **Sign in** with any email and password, or tap Apple or Google. They're simulated, and you sign in locally as the
  demo guest, Alex Morgan.
- **The manager's console** is under **Profile → Restaurant admin**.
- **Place an order:** it moves itself forward every 8 seconds (preparing, on the way, delivered), with an inbox entry
  and a toast.
- **Promo codes:** `FIG10` and `WEEKNIGHT15`. `LUNCH20` is switched off in the console, where you can turn it on.
- **Admin changes apply live:**
  - closing the kitchen blocks ordering;
  - marking a dish sold out shows "Sold out";
  - hiding a category or a Home section removes it from the app.
- Everything lives in memory, so relaunching the app resets the demo data.

## 6. Troubleshooting

| What you see | What to do |
| --- | --- |
| CocoaPods fails with `Unicode Normalization not appropriate for ASCII-8BIT` | Set a UTF-8 locale, then build again: `export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` |
| "No development build installed", or the app opens in Expo Go | Build the app once with `npx expo run:ios` or `npx expo run:android`. Then `npx expo start` and press `i` or `a` |
| A crash like "native module not found" after installing a package or editing `app.json` | Build again with `npx expo run:ios` or `npx expo run:android`. Native changes need a new build |
| `npx expo run:ios` can't find a simulator | Open Xcode → Settings → Components and install an iOS simulator. Then open the Simulator app and try again |
| Android: "no devices" | Start a virtual device from Android Studio's **Device Manager** first, then run `npx expo run:android` |
| Port 8081 is already in use | Close the other Metro window, or use another port: `npx expo start --port 8082` |
| Strange errors after switching checkpoints | Clear Metro's cache: `npx expo start -c` |
| Errors on `href` or `router.push` in chapter 26 | Run `npx expo start` once. It generates the route types in `.expo/types` |
| A screen looks different from the video | Compare the file with that chapter's checkpoint, using **What changed** in the README |
| Food photos don't show | They load from Unsplash, so check the simulator's internet connection |
| `rm -rf` doesn't work on Windows | Delete the folders in File Explorer, or in PowerShell: `Remove-Item -Recurse -Force <folder>` |

Still stuck? Comment on the [video](https://youtu.be/dRi0hSMB4r8) with the chapter number, the command you ran and what
you see.

## 7. Going further: the full-stack edition

The course app runs on local data. The **full-stack edition** is the same app, connected to everything a real
restaurant needs:

- its own API (Fastify 5 on Node) with a shared Zod contract;
- Firestore;
- Firebase sign-in with email, Apple and Google;
- Stripe payments (card, Apple Pay, Google Pay, refunds);
- ImageKit photo uploads;
- the restaurant team: front of house, kitchen, dispatch and courier queues, with roles.

It comes with a setup guide from a fresh computer to the App Store and Google Play.

**[Get the full-stack source code →](https://buymeacoffee.com/reactbd/e/595519)**
