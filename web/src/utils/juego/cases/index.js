import { CASE_001 } from './case-001';
import { CASE_002 } from './case-002';
import { CASE_003 } from './case-003';
import { CASE_004 } from './case-004';
import { CASE_005 } from './case-005';
import { CASE_006 } from './case-006';
import { CASE_007 } from './case-007';
import { CASE_008 } from './case-008';
import { CASE_009 } from './case-009';
import { CASE_010 } from './case-010';

export const ALL_CASES = [
  CASE_001,
  CASE_002,
  CASE_003,
  CASE_004,
  CASE_005,
  CASE_006,
  CASE_007,
  CASE_008,
  CASE_009,
  CASE_010,
];

export function getCaseById(id) {
  return ALL_CASES.find((c) => c.id === id) || CASE_001;
}