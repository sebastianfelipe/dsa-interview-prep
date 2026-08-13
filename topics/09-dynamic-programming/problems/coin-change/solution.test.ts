import * as path from 'path';
import { fileURLToPath } from 'url';
import * as solution from './solution';
import { testSolutionCases } from '@lib/cases-vitest';

testSolutionCases(path.dirname(fileURLToPath(import.meta.url)), solution as Record<string, unknown>);
