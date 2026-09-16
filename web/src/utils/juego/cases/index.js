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
import { CASE_011 } from './case-011';
import { CASE_012 } from './case-012';
import { CASE_013 } from './case-013';
import { CASE_014 } from './case-014';
import { CASE_015 } from './case-015';
import { CASE_016 } from './case-016';
import { CASE_017 } from './case-017';
import { CASE_018 } from './case-018';
import { CASE_019 } from './case-019';
import { CASE_020 } from './case-020';

export const ALL_CASES = [
  CASE_001, CASE_002, CASE_003, CASE_004, CASE_005,
  CASE_006, CASE_007, CASE_008, CASE_009, CASE_010,
  CASE_011, CASE_012, CASE_013, CASE_014, CASE_015,
  CASE_016, CASE_017, CASE_018, CASE_019, CASE_020,
];

export function getCaseById(id) {
  return ALL_CASES.find((c) => c.id === id) || CASE_001;
}