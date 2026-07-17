// Generates src/lib/iconify-offline-data.json from the icon names actually
// used across the app (via <Icon icon="prefix:name" />), so they can be
// registered locally with @iconify/react's addCollection() instead of being
// fetched at runtime from the Iconify API.
//
// Regenerate after adding/removing icon usages:
//   1. Update the ICONS list below (grep for icon="..." usages), or run:
//      grep -rhoE 'icon="[a-zA-Z0-9-]+:[a-zA-Z0-9-]+"' src --include="*.tsx" | sort -u
//   2. npm run generate-icons

import { getIconData } from '@iconify/utils';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ICONS = [
  'ic:outline-tiktok',
  'lucide:activity', 'lucide:alert-circle', 'lucide:arrow-right', 'lucide:award',
  'lucide:bar-chart-3', 'lucide:calendar', 'lucide:calendar-x', 'lucide:camera',
  'lucide:check', 'lucide:check-circle', 'lucide:chevron-down', 'lucide:chevron-left',
  'lucide:chevron-right', 'lucide:clipboard-list', 'lucide:clock', 'lucide:download',
  'lucide:edit', 'lucide:eye', 'lucide:file-spreadsheet', 'lucide:file-text',
  'lucide:layout-dashboard', 'lucide:list', 'lucide:loader-2', 'lucide:lock',
  'lucide:log-out', 'lucide:map-pin', 'lucide:moon', 'lucide:pause',
  'lucide:play', 'lucide:plus', 'lucide:qr-code', 'lucide:refresh-ccw',
  'lucide:search', 'lucide:sun', 'lucide:trash-2', 'lucide:trending-up',
  'lucide:trophy', 'lucide:upload', 'lucide:users', 'lucide:x',
  'lucide:x-circle',
  'mdi:calendar', 'mdi:calendar-blank', 'mdi:email', 'mdi:email-outline',
  'mdi:external-link', 'mdi:flash', 'mdi:handshake', 'mdi:heart-outline',
  'mdi:instagram', 'mdi:paper-plane', 'mdi:run-fast', 'mdi:sign-in',
  'mdi:spotify', 'mdi:strava', 'mdi:twitter', 'mdi:users',
  'mdi:whatsapp',
];

const collectionsByPrefix = {};
for (const entry of ICONS) {
  const [prefix, name] = entry.split(':');
  if (!collectionsByPrefix[prefix]) {
    const mod = await import(`@iconify-json/${prefix}/icons.json`, { with: { type: 'json' } });
    collectionsByPrefix[prefix] = mod.default;
  }
}

const output = {};
for (const entry of ICONS) {
  const [prefix, name] = entry.split(':');
  const data = getIconData(collectionsByPrefix[prefix], name);
  if (!data) {
    throw new Error(`Icon not found: ${entry}`);
  }
  if (!output[prefix]) {
    output[prefix] = { prefix, icons: {} };
  }
  output[prefix].icons[name] = data;
}

const outPath = join(__dirname, '..', 'src', 'lib', 'iconify-offline-data.json');
writeFileSync(outPath, JSON.stringify(output));
console.log(`Wrote ${ICONS.length} icons across ${Object.keys(output).length} collection(s) to ${outPath}`);
