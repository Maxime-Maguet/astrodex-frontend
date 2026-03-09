const MagnitudeLimite = {
  "Yeux nus": 6,
  Jumelles: 10,
  "Télescope débutant": 12,
  "Télescope avancé": 15,
};

export function filtrerAstresParEquipement(astres, equipement) {
  const magnitudeMax = MagnitudeLimite[equipement] ?? 6;
  return astres.filter((astre) => astre.magnitude <= magnitudeMax);
}
