// Couleurs feuillage partagées
export const FOLIAGE_COLORS = [
  "#4b6f44", "#6b8e23", "#7c9d5f", "#3e5c23", "#a3c585", "#b7d7a8",
  "#b93a32", "#e25822", "#d2691e", "#f7cac9", "#f9d5e5", "#f6b7c1",
  "#ffe4f0", "#ffb7d5"
] as const;

import { ClassicTree } from "./types/ClassicTree"
import { BambooTree } from "./types/BambooTree"
import { MapleTree } from "./types/MapleTree"
import { PineTree } from "./types/PineTree"
import { SakuraTree } from "./types/SakuraTree"

export const TREE_TYPES = {
  classic: ClassicTree,
  bamboo: BambooTree,
  maple: MapleTree,
  pine: PineTree,
  sakura: SakuraTree,
} as const;

export type TreeKind = keyof typeof TREE_TYPES;
export interface TreeData {
  pos: [number, number, number];
  kind: TreeKind;
}
