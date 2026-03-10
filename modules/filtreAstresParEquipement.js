export const MagnitudeLimite = {
  "Oeil nu": 0,
  Jumelles: 4,
  "Lunette astronomique": 15,
};

//par soucis de temps (et j'avais pas envie de tout casser), j'ai mis les données en brut, plus tard, il faudra fetch au démarrage les magnitudes de la bdd et les stockées dans le reducer
const MAGNITUDE_ASTRES = {
  Moon: -12.7,
  Mars: -2.3,
  Andromède: 3.4,
  Uranus: 5.7,
  Sirius: -1.46,
  Mercury: -2.2,
  Neptune: 7.8,
  Venus: -4.6,
  Jupiter: -2.7,
  Saturn: -0.4,
  "Nébuleuse d'Orion": 4,
};

export function filtrerAstresParEquipement(visibleAstres, equipement) {
  const magnitudeMax = MagnitudeLimite[equipement] ?? 0;
  return visibleAstres.filter((nom) => {
    const magnitude = MAGNITUDE_ASTRES[nom];
    if (magnitude === undefined) return true;
    return magnitude <= magnitudeMax;
  });
}
