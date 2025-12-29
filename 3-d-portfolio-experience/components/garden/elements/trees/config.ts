// Configuration centralisée des arbres
export const TREE_CONFIG = {
  TREE_COUNT: 40,
  AREA_SIZE: 40,
  TRUNK: {
    HEIGHT: 3,
    RADIUS_TOP: 0.2,
    RADIUS_BOTTOM: 0.3,
    COLOR: "#4a3728",
    ROUGHNESS: 0.9,
    Y_POSITION: 1.5,
  },
  FOLIAGE: {
    RADIUS: 1.5,
    Y_POSITION: 3.5,
    ROUGHNESS: 0.7,
    OPACITY: 0.9,
  },
  COLLISION: {
    HALF_EXTENTS: [1.5, 2, 1.5] as [number, number, number],
  },
  SEED: 12345,
} as const;
