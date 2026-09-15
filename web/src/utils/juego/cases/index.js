import { CASE_001 } from './case-001';
import { CASE_002 } from './case-002';
import { CASE_003 } from './case-003';
import { CASE_004 } from './case-004';

export const ALL_CASES = [CASE_001, CASE_002, CASE_003, CASE_004];

export function getCaseById(id) {
  return ALL_CASES.find((c) => c.id === id) || CASE_001;
}