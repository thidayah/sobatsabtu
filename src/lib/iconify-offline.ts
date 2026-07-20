'use client';

import { addCollection } from '@iconify/react';
import iconData from './iconify-offline-data.json';

for (const collection of Object.values(iconData)) {
  addCollection(collection as Parameters<typeof addCollection>[0]);
}
