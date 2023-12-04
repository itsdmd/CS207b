# :iphone: SchoolNexus Mobile

> End-user mobile platform application for SchoolNexus.

This project was scaffolded using [Expo](https://expo.io/).

## Getting Started

```bash
# Install dependencies
npm install
```

There are 3 ways to start the development server:

1. Web browser (recommended)

```bash
npm run web
```

2. Expo Go mobile client

-   Create an [Expo account](https://expo.dev/signup).
-   Contact the project owner to be added to the Expo project.
-   Copy the Expo project ID.
-   Run the following commands:

```bash
# Link to Expo project
eas init --id <expo-project-id>

# You will warned that the slug does not match. Enter `y` to continue.
```

-   Download mobile app [Expo Go](https://expo.dev/client) on your device and login.
-   Run the following command and scan the generated QR code with the Expo Go app.

```bash
# Start Expo server
npx expo start
```

3. Android Studio emulator

-   Download and install [Android Studio](https://developer.android.com/studio).
-   Create a new virtual device and boot it up.
-   Run the following command:

```bash
npm run android
```

> For iOS emulator, you need to have a Mac computer with Xcode installed.
