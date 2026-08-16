import fs from 'node:fs';

const file = 'src/ride/mobilityScreens.tsx';
let source = fs.readFileSync(file, 'utf8');

const importLine = "import { KareebuBodaHomeScreen } from './kareebuBodaHome';";
const marker = '// KAREEBU_BODA_RIDES_PARITY_V1';

if (source.includes(marker) && source.includes(importLine)) {
  console.log('PASS — Boda/Rides parity delegation is already installed.');
  process.exit(0);
}

const typeAnchor = '\nexport type MobilityData = {';
if (!source.includes(typeAnchor)) {
  throw new Error('Could not locate MobilityData type anchor.');
}
if (!source.includes('export function MobilityHomeScreen(')) {
  throw new Error('Could not locate legacy MobilityHomeScreen.');
}
if (!source.includes('KAREEBU MOBILITY')) {
  throw new Error('The legacy MobilityHomeScreen no longer matches the audited structure.');
}

if (!source.includes(importLine)) {
  source = source.replace(typeAnchor, `\n${importLine}\n${typeAnchor}`);
}

source = source.replace(
  'export function MobilityHomeScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {',
  'function LegacyMobilityHomeScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {',
);

const legacyAnchor = 'function LegacyMobilityHomeScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {';
const legacyIndex = source.indexOf(legacyAnchor);
if (legacyIndex < 0) {
  throw new Error('Could not create LegacyMobilityHomeScreen.');
}

const wrapper = `${marker}
export function MobilityHomeScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  if (data.selectedVehicleMode === 'BODA') {
    return <KareebuBodaHomeScreen data={data} actions={actions} />;
  }

  return <LegacyMobilityHomeScreen data={data} actions={actions} />;
}

`;

source = source.slice(0, legacyIndex) + wrapper + source.slice(legacyIndex);
fs.writeFileSync(file, source);
console.log('PASS — Boda now delegates to the dedicated Rides-parity Boda home.');
