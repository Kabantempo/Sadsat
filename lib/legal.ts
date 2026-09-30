// Médiateur de la consommation : obligatoire pour la vente aux particuliers (art. L612-1 du Code de la consommation).
// Après adhésion à un médiateur, renseigner ces variables d'environnement :
//   MEDIATOR_NAME="Nom du médiateur"   MEDIATOR_URL="https://…"   MEDIATOR_ADDRESS="adresse postale"
const name = process.env.MEDIATOR_NAME
const url = process.env.MEDIATOR_URL
const address = process.env.MEDIATOR_ADDRESS

export const MEDIATION_TEXT = name && url
  ? `Conformément aux articles L611-1 et suivants du Code de la consommation, le client peut recourir gratuitement au médiateur de la consommation : ${name}${address ? `, ${address}` : ''} — ${url}`
  : `Conformément aux articles L611-1 et suivants du Code de la consommation, le client peut recourir gratuitement à un médiateur de la consommation. Ses coordonnées sont communiquées sur simple demande à contact@sadsat.com.`
