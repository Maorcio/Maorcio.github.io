// Utilitaires pour arbres (génération, random, exclusion...)
import type { TreeKind, TreeData } from "./TreeTypes"

export function createSeededRandom(initialSeed: number) {
  let seed = initialSeed
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export function isValidTreePosition(x: number, z: number): boolean {
  // Clairière de spawn du joueur (début du chemin) : cercle de rayon 4 centré en (0, -17)
  const inSpawnClearing = (x * x + (z + 17) * (z + 17)) < 4 * 4;
  // Pagode : rectangle de base 24x24 centré en (0,7) (zone interdite)
  const pagodaCenterX = 0;
  const pagodaCenterZ = 7;
  const pagodaHalf = 12; // BASE_SIZE / 2
  // Exclusion stricte : aucun arbre dans la pagode
  const inPagodaForbidden = (Math.abs(x - pagodaCenterX) < pagodaHalf && Math.abs(z - pagodaCenterZ) < pagodaHalf);

  // Chemin principal : bande rectangulaire centrée en (0, -4), largeur 5 (X), longueur 52 (Z)
  // On ajoute une marge d'exclusion de 1.5 autour du chemin pour éviter que les arbres ne touchent le chemin
  const pathCenterZ = -4;
  const pathWidth = 5;
  const pathLength = 52; // 2x plus long
  const pathMargin = 1.5; // marge d'exclusion autour du chemin
  const inPathBand = Math.abs(x) < (pathWidth / 2 + pathMargin) && Math.abs(z - pathCenterZ) < (pathLength / 2 + pathMargin);
  // Zone autour du chemin principal (bande plus large)
  const pathOuterWidth = 10;
  const pathOuterLength = 64; // 2x plus long
  const inPathOuter = Math.abs(x) < pathOuterWidth / 2 && Math.abs(z - pathCenterZ) < pathOuterLength / 2;
  const inPathMargin = inPathOuter && !inPathBand;

  // Chemin autour de la pagode : anneau de rayon 7 autour de (0, 7), largeur 3 (interdit)
  const rLoop = 7;
  const loopWidth = 3;
  const dxPagoda = x - pagodaCenterX;
  const dzPagoda = z - pagodaCenterZ;
  const distToPagoda = Math.sqrt(dxPagoda * dxPagoda + dzPagoda * dzPagoda);
  const inPathLoop = distToPagoda > (rLoop - loopWidth / 2) && distToPagoda < (rLoop + loopWidth / 2);
  // Zone autour de l'anneau (bande plus large)
  const loopOuter = 10;
  const inLoopOuter = distToPagoda > (rLoop + loopWidth / 2) && distToPagoda < (rLoop + loopOuter / 2);
  const inLoopMargin = inLoopOuter;

  // Les arbres sont autorisés UNIQUEMENT dans les marges autour du chemin principal ou de l'anneau
  // et jamais sur la pagode, ni sur le chemin, ni sur l'anneau
  if (inPagodaForbidden || inPathBand || inPathLoop || inSpawnClearing) return false;
  if (inPathMargin || inLoopMargin) return true;
  return false;
}

export function generateTreePositions(count: number, areaSize: number, seed: number): TreeData[] {
  const random = createSeededRandom(seed)
  const trees: TreeData[] = [];
  let attempts = 0;
  const maxAttempts = count * 20;
  // Proportions (modifiable facilement)
  const proportions: [TreeKind, number][] = [
    ["classic", 0.20],
    ["bamboo", 0.15],
    ["maple", 0.18],
    ["pine", 0.18],
    ["sakura", 0.29],
  ];
  const pickKind = () => {
    const r = random();
    let acc = 0;
    for (const [kind, p] of proportions) {
      acc += p;
      if (r < acc) return kind;
    }
    return "classic";
  };
  while (trees.length < count && attempts < maxAttempts) {
    const x = random() * areaSize - areaSize / 2;
    const z = random() * areaSize - areaSize / 2;
    if (isValidTreePosition(x, z)) {
      const kind = pickKind();
      trees.push({ pos: [x, 0, z], kind });
    }
    attempts++;
  }
  return trees;
}
