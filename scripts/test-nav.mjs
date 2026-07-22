import assert from 'node:assert/strict';
import { placeExamplesAfterReference } from '../src/lib/nav.ts';

const navigationGroup = (label) => ({ label, items: [] });
const labelsOf = (groups) => groups.map(({ label }) => label);

const misplacedGroups = [
  navigationGroup('Start'),
  navigationGroup('Examples'),
  navigationGroup('Guides'),
  navigationGroup('Reference'),
  navigationGroup('Support'),
];

assert.deepEqual(labelsOf(placeExamplesAfterReference(misplacedGroups)), [
  'Start',
  'Guides',
  'Reference',
  'Examples',
  'Support',
]);

const correctGroups = [navigationGroup('Reference'), navigationGroup('Examples')];
assert.strictEqual(placeExamplesAfterReference(correctGroups), correctGroups);

const missingReference = [navigationGroup('Examples'), navigationGroup('Support')];
assert.strictEqual(placeExamplesAfterReference(missingReference), missingReference);

const missingExamples = [navigationGroup('Reference'), navigationGroup('Support')];
assert.strictEqual(placeExamplesAfterReference(missingExamples), missingExamples);
