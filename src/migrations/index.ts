import * as migration_20250709_190557 from './20250709_190557';

export const migrations = [
  {
    up: migration_20250709_190557.up,
    down: migration_20250709_190557.down,
    name: '20250709_190557'
  },
];
