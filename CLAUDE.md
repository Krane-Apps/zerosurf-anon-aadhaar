# anon-aadhaar react native library

## overview

react native library for zero-knowledge proof generation from aadhaar qr codes using mopro (mobile proving) for on-device groth16 proof generation.

## architecture

### core components

- **mopro integration**: rust-based proving system with uniffi bindings for ios/android
- **groth16 proving**: on-device zk proof generation using rapidsnark backend
- **qr scanning**: aadhaar qr code parsing and signature verification
- **field revelation**: selective disclosure of identity fields (age>18, gender, state, pincode)

### steps to run

yarn install
yarn start
npx expo start --clear

if app is not able to find the bindings
npx expo prebuild --clean

run on ios using expo
npx expo start --ios

if we need to kill the expo server
pkill -f "expo start" || true

for zerosurf mobile

1. Run on iOS simulator: npx expo run:ios
2. Run on Android: npx expo run:android

### project structure

```
├── src/                          # main library source
│   ├── groth16Prover.ts         # proof generation core
│   ├── provider/                # react context management
│   ├── ProveModal/              # ui components for proof flow
│   └── types.ts                 # type definitions
├── ios/                         # ios native module
│   ├── MoproiOSBindings/        # rust ffi bindings
│   └── AnonAadhaarPackageModule.swift
├── android/                     # android native module
│   └── src/main/java/expo/modules/anonaadhaar/
├── zerosurf-mobile/             # zerosurf mobile app
└── package.json                 # expo module config
```

## key components

### 1. proof generation flow

**setup**: `src/groth16Prover.ts:9`

- downloads compressed verifier artifacts to device storage
- extracts zkey/wasm files for circuit proving

**proof generation**: `src/groth16Prover.ts:39`

```typescript
groth16ProveWithZKeyFilePath({
  zkeyFilePath: string,
  inputs: AnonAadhaarArgs,
  signal?: string
})
```

- calls mopro native module for groth16 proof generation
- returns structured proof with public signals
- automatically saves proof to device storage

### 2. mopro native integration

**android**: `android/src/main/java/expo/modules/anonaadhaar/AnonAadhaarPackageModule.kt:34`

- uses uniffi rust bindings via `uniffi.mopro.*`
- rapidsnark backend for proof generation
- proof verification capabilities

**ios**: `ios/AnonAadhaarPackageModule.swift`

- similar uniffi integration pattern
- uses precompiled xcframework binaries

**native functions**:

- `generateCircomProof(zkeyPath, inputs)`
- `verifyProof(zkeyPath, proofResult)`

### 3. provider pattern

**context**: `src/provider/AnonAadhaarProvider.tsx:56`

```typescript
<AnonAadhaarProvider>
  {/* app components */}
</AnonAadhaarProvider>
```

- manages authentication state
- persists proofs in device storage
- provides hooks for proof access

**state management**: `src/hooks/useAnonAadhaar.ts`

- `status: 'logged-out' | 'logged-in'`
- proof persistence and retrieval

### 4. ui components

**prove trigger**: `src/ProveModal/AnonAadhaarProve.tsx:8`

```typescript
<AnonAadhaarProve
  buttonMessage="Create Proof"
  nullifierSeed={1234}
  fieldsToRevealArray={['revealAgeAbove18', 'revealState']}
  signal="0xa527e0029e720D5f31c8798DF7b107Fad54f40E6"
/>
```

**modal flow**: guides user through:

1. qr code scanning
2. field selection
3. proof generation
4. result display

### 5. field revelation

**configurable disclosure**: `src/types.ts:3`

```typescript
type FieldsToReveal = {
  revealAgeAbove18: boolean;
  revealGender: boolean;
  revealState: boolean;
  revealPinCode: boolean;
};
```

## data flow

1. **qr scan**: user scans aadhaar qr with device camera
2. **signature verification**: validates uidai signature using embedded certificates
3. **input generation**: converts qr data to circuit-compatible format
4. **proof generation**: calls mopro native module for groth16 proving
5. **proof storage**: saves to device with react-native-storage
6. **verification**: optional on-device proof verification

## example usage

**app setup**: `zerosurf-mobile/src/App.tsx:14`

```typescript
export default function App() {
  const [setupReady, setSetupReady] = useState(false);

  useEffect(() => {
    setupProver().then(() => setSetupReady(true));
  }, []);

  return (
    <AnonAadhaarProvider>
      <NavigationContainer>
        {/* screens */}
      </NavigationContainer>
    </AnonAadhaarProvider>
  );
}
```

**home screen integration**: `zerosurf-mobile/src/Screens/HomeScreen.tsx:25`

```typescript
const [anonAadhaarStatus] = useAnonAadhaar();

return (
  <AnonAadhaarProve
    buttonMessage="Start"
    signal="0xa527e0029e720D5f31c8798DF7b107Fad54f40E6"
    nullifierSeed={1234}
    fieldsToRevealArray={['revealAgeAbove18', 'revealState']}
  />
);
```

## technical details

### circuit parameters

- **curve**: bn128
- **protocol**: groth16
- **backend**: rapidsnark via mopro

### dependencies

- **mopro**: rust proving framework with mobile ffi
- **expo**: react native framework
- **uniffi**: rust-to-native bindings generator
- **rapidsnark**: high-performance groth16 prover

### performance considerations

- proof generation: ~10-30s on mobile devices
- setup download: ~50mb compressed artifacts
- storage: proofs persist indefinitely unless cleared

## security model

- **on-device proving**: private inputs never leave device
- **nullifier system**: prevents proof reuse with same seed
- **signature verification**: validates aadhaar authenticity
- **selective disclosure**: only chosen fields revealed in proof

# Proof Structure

```typescript
{
    "groth16Proof": {
      "a": {
        "x": "15656916869833218087485644952657365616320617403989649258418307440121032454463",
        "y": "1358312558330230047730307066024724889972109681875191804884909405399918581083"
      },
      "b": {
        "x": [
          "18262211351636080233041255190103294379018294554320156561046219353152987441543",
          "8153182255759538491909024025288601120419470479055276287840855374509998811800"
        ],
        "y": [
          "4423017455877144264882949286511375691915824178776701257378186632718145735206",
          "7713060996520493002189016329529988590243037963127685437034100361504492853916"
        ]
      },
      "c": {
        "x": "12687837377493903459403526874761659472262289883315890342922842229798520876891",
        "y": "11636399316642327087338929396504043028772844769492808860445356942719670997737"
      }
    },
    "pubkeyHash": "18063425702624337643644061197836918910810808173893535653269228433734128853484",
    "timestamp": "1758918600",
    "nullifierSeed": "1234",
    "nullifier": "9088346564142123024574859856549747489755793573544154986843628093064543185858",
    "signalHash": "102067594801672174990214651541021071483607678883906879039573470029801580418",
    "ageAbove18": "1",
    "gender": "0",
    "state": "0",
    "pincode": "2036160836166212018514",
    "signal": "0xa527e0029e720D5f31c8798DF7b107Fad54f40E6"
  }
```