import * as Astronomy from "astronomy-engine";

export const FIXED_COORDINATES = {
  Andromède: { ra: 0.7122, dec: 41.2689 },
  Sirius: { ra: 6.7525, dec: -16.7161 },
  "Nébuleuse d'Orion": { ra: 5.5881, dec: -5.3908 },
};

/**
 * Filtre une liste d'astres pour ne garder que ceux au-dessus de l'horizon
 * @param {Array} bodies - Liste des noms d'astres (ex: ["Mars", "Sirius"])
 * @param {Object} coords - Coordonnées GPS { latitude, longitude }
 */
export const AstresVisibles = (bodies, coords) => {
  if (!coords || !bodies || bodies.length === 0) return [];

  const observer = new Astronomy.Observer(
    coords.latitude,
    coords.longitude,
    coords.altitude || 0,
  );
  const date = new Date();

  return bodies.filter((bodyName) => {
    let ra, dec;

    if (FIXED_COORDINATES[bodyName]) {
      ra = FIXED_COORDINATES[bodyName].ra;
      dec = FIXED_COORDINATES[bodyName].dec;
    } else {
      try {
        const equ = Astronomy.Equator(bodyName, date, observer, true, true);
        ra = equ.ra;
        dec = equ.dec;
      } catch (e) {
        return false;
      }
    }

    const hor = Astronomy.Horizon(date, observer, ra, dec, "normal");
    return hor.altitude > 0;
  });
};
