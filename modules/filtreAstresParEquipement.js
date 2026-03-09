const MagnitudeLimite = {
  "Oeil nue": 6,
  Jumelles: 10,
  "Lunette astronomique": 15,
};

export function filtrerAstresParEquipement(astres, equipement) {
  const magnitudeMax = MagnitudeLimite[equipement] ?? 6;
  return astres.filter((astre) => astre.magnitude <= magnitudeMax);
}
