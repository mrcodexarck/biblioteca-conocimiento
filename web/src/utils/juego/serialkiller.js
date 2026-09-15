import { SUSPECTS, KILLER_ID } from './suspects';

/* =========================================================
   20 PISTAS - Todas no obvias (sin género)
   ========================================================= */
export const CLUES = [
  { caseId: 'case-001', attribute: 'dominantHand',  value: 'zurdo',           text: 'El forense determinó que el ataque vino de un zurdo.' },
  { caseId: 'case-002', attribute: 'bloodType',     value: 'AB-',             text: 'Sangre seca bajo la uña de la víctima: tipo AB-.' },
  { caseId: 'case-003', attribute: 'tattoo',        value: 'Serpiente',       text: 'Testigo: "Tenía una serpiente tatuada en la espalda".' },
  { caseId: 'case-004', attribute: 'pet',           value: 'Serpiente',       text: 'El asesino compró un terrario para serpientes hace meses.' },
  { caseId: 'case-005', attribute: 'vehicle',       value: 'Moto',            text: 'Huyó en una moto negra sin placa.' },
  { caseId: 'case-006', attribute: 'languages',     value: '4+',              text: 'El testigo lo oyó hablar perfecto en 4 idiomas.' },
  { caseId: 'case-007', attribute: 'sport',         value: 'Boxeo',           text: 'Los golpes son de alguien entrenado en boxeo.' },
  { caseId: 'case-008', attribute: 'allergy',       value: 'Penicilina',      text: 'En la escena había un frasco de antibióticos alternativos.' },
  { caseId: 'case-009', attribute: 'music',         value: 'Clasica',         text: 'Dejaba música clásica sonando al matar.' },
  { caseId: 'case-010', attribute: 'zodiac',        value: 'Piscis',          text: 'Un símbolo de Piscis grabado en el arma.' },
  { caseId: 'case-011', attribute: 'feature',       value: 'Cicatriz',        text: 'Testigo: "Tenía una cicatriz profunda en la cara".' },
  { caseId: 'case-012', attribute: 'height',        value: 'muy alto',        text: 'Tuvo que agacharse para entrar por la puerta. Muy alto.' },
  { caseId: 'case-013', attribute: 'weight',        value: 'atlético',        text: 'Huellas profundas pero ágiles: complexión atlética.' },
  { caseId: 'case-014', attribute: 'hair',          value: 'castaño oscuro',  text: 'Cabello castaño oscuro en el pasamontañas.' },
  { caseId: 'case-015', attribute: 'eyes',          value: 'azul grisáceo',   text: 'Retrato hablado: ojos azul grisáceo.' },
  { caseId: 'case-016', attribute: 'hasRecord',     value: 'Si',              text: 'ADN coincide con una ficha policial antigua.' },
  { caseId: 'case-017', attribute: 'maritalStatus', value: 'Divorciado',      text: 'Su ex-pareja lo reconoció por un anillo de divorcio.' },
  { caseId: 'case-018', attribute: 'birthMonth',    value: 'Mar',             text: 'Fecha grabada en el arma: 15 de marzo.' },
  { caseId: 'case-019', attribute: 'occupation',    value: 'Arquitecto',      text: 'Los planos usados son de un estudio de arquitectura.' },
  { caseId: 'case-020', attribute: 'district',      value: 'Pearl District',  text: 'Su moto fue captada entrando al Pearl District.' },
];

export const TOTAL_CASES = 20;

export function getKnownClues(completedCases) {
  return CLUES.filter((c) => completedCases.includes(c.caseId));
}

export function applyClues(suspects, knownClues) {
  return suspects.map((s) => {
    let eliminated = false;
    let eliminatedBy = null;
    for (const clue of knownClues) {
      if (s[clue.attribute] !== clue.value) {
        eliminated = true;
        eliminatedBy = clue;
        break;
      }
    }
    return { ...s, eliminated, eliminatedBy };
  });
}

export function getActiveSuspects(suspects, knownClues) {
  return applyClues(suspects, knownClues).filter((s) => !s.eliminated);
}

export function canAccuse(suspects, knownClues) {
  return getActiveSuspects(suspects, knownClues).length === 1;
}

export function checkAccusation(suspectId) {
  return suspectId === KILLER_ID;
}