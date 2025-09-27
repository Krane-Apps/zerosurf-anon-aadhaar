### Hackathon Details
About
The Ethereum Foundation is a non-profit that supports Ethereum. We work alongside the wider ecosystem to improve the protocol, grow our community, and advocate for Ethereum.


🎨 Best Applications on General Privacy ⸺ $3,500
🥇
1st place
$2,000
🥈
2nd place
$1,000
🥉
3rd place
$500
All kinds of projects are welcome, especially innovative solutions for real-world problems.
1️⃣ Credential Sharing: prove professional qualifications (degrees, licenses) stored as digitally signed PDFs and generate interesting use cases.
2️⃣ Mobile Gaming: ZK-based mobile games using the Mopro stack, such as ZK Escape Room, ZK Werewolf.
3️⃣ Matching Apps: Zero-knowledge powered matching applications across multiple domains like dating or job matching scenarios.
👉 Please make sure to check out these project ideas for inspiration!
Qualification Requirements
- Built with, or integrated with, the Mopro stack or zkPDF
- If using Mopro, PoC must be capable of running on mobile devices; live demo preferred
- If using zkPDF: projects should utilize the zkPDF stack without requiring a full server deployment for proof generation — remote proving or a prover network is sufficient

Anon Aadhaar React Native
A React Native library that allows mobile applications to generate and verify zero knowledge proofs from the Aadhaar QR code.

Features
Scan Aadhaar secure QR codes and verify the UIDAI signature
Generate Groth16 proofs for the selected identity fields
Provide a context provider for easy integration in React Native apps
Includes a modal component to guide the user through the proof generation flow
Installation
# Yarn
yarn add @anon-aadhaar/react-native
# or npm
npm install @anon-aadhaar/react-native
The repository is a monorepo managed with Yarn workspaces. Run yarn in the root directory to install all dependencies including the example application.

Usage
Setup the prover – download the proving artifacts once when your app starts:
import { setupProver } from '@anon-aadhaar/react-native';

useEffect(() => {
  setupProver();
}, []);
Wrap your application with AnonAadhaarProvider so that child components can access the proof state:
import { AnonAadhaarProvider } from '@anon-aadhaar/react-native';

export default function App() {
  return (
    <AnonAadhaarProvider>
      {/* your navigation / screens */}
    </AnonAadhaarProvider>
  );
}
Trigger the proof creation using the AnonAadhaarProve component. It opens a modal that guides the user to scan the QR code and generates the proof.
import { AnonAadhaarProve } from '@anon-aadhaar/react-native';

<AnonAadhaarProve buttonMessage="Create Proof" nullifierSeed={1234} />;
Check the example/ folder for a complete Expo application demonstrating these steps.

Contributing
See the contributing guide to learn how to contribute to the repository and the development workflow.

License
MIT

Introducing Mopro: The Mobile Prover Toolkit
Mopro is a developer toolkit designed to make building mobile-native ZK apps easier, faster, and more accessible. Whether you're a ZK protocol author, a mobile app developer, or a Rust engineer exploring zero-knowledge proofs, Mopro provides a streamlined workflow to bring your ideas to mobile devices.

🚀 What Is Mopro?
Mopro simplifies the development of mobile-native apps by offering:

mopro-ffi simplifies the manual UniFFI setup process and enables a modular approach to proving systems.
A powerful CLI to scaffold, build, and update projects
Prebuilt templates for iOS, Android, React Native, and Flutter
Clear, step-by-step documentation to guide developers at every stage
Cross-platform–friendly Rust tooling for building native apps
Our goal is to remove the friction from mobile ZK app development—so you can focus on your product, not the plumbing.

⚡ Why Mobile-Native?
Mobile-native apps offer several key advantages:

Up to 10× performance boost compared to browser-based ZK applications. See our benchmarks for detailed comparisons.
Seamless user experience and deep integration with device capabilities — including biometrics 🫆, GPS 📍, NFC 💳, camera 📸, photo gallery 🌅, Bluetooth 🛜, and push notifications 🔔.
Offline readiness and improved reliability in real-world usage.
These benefits help bring your ZK protocol to a broader, more mainstream audience with better performance and usability.

🔧 How It Works
Mopro takes each proving system and wraps it as an adapter written in Rust. These adapters provide a unified interface for ZK proof generation regardless of the backend (e.g., Circom, Noir, Halo2). Mopro then uses UniFFI to generate native bindings for Swift (iOS) and Kotlin (Android) from Rust code. These bindings can then be reused in cross-platform frameworks like React Native and Flutter, with ready-to-use templates for each platform.

🏗️ Architecture Overview
The interactive diagram below shows the complete mopro architecture, illustrating how different components interact across the entire stack. You can zoom and pan around the diagram, and hover over components to learn more about their role in the system.

+
−
⌂
roles
app
mobile native lib
mobile rust lib
middleware
proving system
circuits
No brain
Mobile brain
Rusty brain
ZK brain
User
App dev
Tooling/ Infra dev
Circuits dev
iOS app
Android app
react native app
flutter app
mopro swift lib
mopro kotlin lib
mopro react
native lib
mopro flutter lib
mopro-ffi (mopro-cli)
circom-compat
circom-prover
halo2
noir
arkworks
rapidsnark
plonk
hyperplonk
gemini
barretenberg
circom circuits
halo2 circuits
Noir circuits
👩‍💻 Who It's For
📱 ZK Mobile App Developers
Get a full-stack monorepo template that handles Rust bindings, mobile UIs, and proof generation. Just follow the mopro CLI to bootstrap your app from zero to working prototype. See Getting Started.

🔐 ZK Protocol Developers
Don't want to maintain a full app? No problem. Mopro helps you ship production-ready mobile SDKs for your protocol, making it easier for others to integrate your tech.

See Mopro Bindings for Multiplatform

mopro-kotlin-package: Kotlin bindings for Android.
mopro-swift-package: Swift bindings for iOS.
mopro-react-native-package: A React Native wrapper.
mopro_flutter_package: Flutter bindings for Dart-based apps.
📲 Mobile Developers
Easily consume ZK SDKs via familiar package managers like CocoaPods, Gradle, npm, or pub.dev. No Rust knowledge required.

🦀 Rust Developers
Mopro supports various ZK backends—even those not originally written in Rust—via wrapper crates.

Examples include

circom-prover
witnesscalc_adapter
rust-rapidsnark
noir-rs.
⚙️ GPU Acceleration
Mopro also focuses on mobile-native GPU acceleration, enabling client-side devices to leverage their GPUs to speed up operations like MSM (Multi-Scalar Multiplication) during proof generation. This significantly improves performance for ZK proving on mobile.

See implementation details and updates in gpu-acceleration.

📚 Learn More About Mopro
Explore the full ecosystem, documentation, and community resources:

📱 Main GitHub Repository: https://github.com/zkmopro/mopro
💡 Example Projects: https://zkmopro.org/docs/projects
💬 Community & Talks: https://zkmopro.org/docs/community
📰 Blog: https://zkmopro.org/blog

React Native SDK
In this section, you'll learn how to build a React Native SDK using Mopro's native bindings. The process includes the following steps:

Generate the binding using the Mopro CLI
Integrate the binding into a React Native Package
How to install the React Native SDK via npm
How to use the package
How to run an example app
Generate the bindings using the Mopro CLI
To get started with building Mopro bindings, refer to the Getting Started section. If you’d like to generate custom bindings for your own circuits or proving schemes, see the guide: Rust Setup for Android/iOS Bindings.

Then you will have a MoproAndroidBindings and/or MoproiOSBindings in the project directory.

Integrate the bindings into a React Native Package
Clone the SDK template repository:
git clone https://github.com/zkmopro/mopro-react-native-package

Replace the generated bindings:
iOS: Replace the bindings directory MoproiOSBindings with the generated files in the following location:

ios/MoproiOSBindings
Android: Replace the bindings directory MoproAndroidBindings/uniffi and MoproAndroidBindings/jniLibs with your generated files in the following location:

android/src/main/java/uniffi
android/src/main/jniLibs
Define the module API
iOS:
Define the native module API in ios/MoproReactNativePackageModule.swift to match the React Native type. Please refer to Expo - Argument Types.
Android:
Then define the native module API in android/src/main/java/expo/modules/moproreactnativepackage/MoproReactNativePackageModule.kt to match the React Native type. Please refer to Expo - Argument Types.
React Native:
Define React Native's module APIs to pass messages between React Native and your desired platforms.
src/MoproReactNativePackageModule.ts
src/MoproReactNativePackageView.tsx
How to install the React Native SDK via npm
Use a Node.js package manager in your React Native app to install dependencies. For example:

# npm
npm install https://github.com/zkmopro/mopro-react-native-package # Or change to your own URL
# yarn / pnpm
yarn add https://github.com/zkmopro/mopro-react-native-package # Or change to your own URL


Alternatively, you can manually add it to your package.json:

"dependencies": {
 "mopro-react-native-package": "github:zkmopro/mopro-react-native-package", // Or change to your own URL
}


How to use the package
Here is an example of how to integrate and use this package

import MoproReactNativePackage, { Result } from "mopro-react-native-package";

const circuitInputs = {
    a: [a],
    b: [b],
};

const proofResult: CircomProofResult =
    MoproReactNativePackage.generateCircomProof(
        ZKEY_PATH,
        JSON.stringify(circuitInputs)
    );

const isValid: boolean = await MoproReactNativePackage.verifyProof(
    ZKEY_PATH,
    parsedProofResult
);

console.log("Proof verification result:", isValid);

How to run an example app
Open the example app that uses the defined react native package in the example/ folder

cd example

Install the dependencies

npm install

Run on iOS simulator

npm run ios

Run on iOS device

npm run ios:device

Run on Android emulator/device (if connected) Set the ANDROID_HOME environment variable.

export ANDROID_HOME=~/Library/Android/sdk/

Run on Android emulator/device (if connected)

npm run android