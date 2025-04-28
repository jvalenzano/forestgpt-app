import fs from 'fs';

const filePath = './client/src/components/ForestRegionMap.tsx';
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract the forestRegions array content using regex
const regionsMatch = fileContent.match(/export const forestRegions.*?= \[(.*?)\];/s);

if (!regionsMatch) {
  console.error('Could not extract forestRegions data from the file');
  process.exit(1);
}

// Extract all the states and stateFacts from the file
const statesRegex = /states: \[(.*?)\]/g;
const stateFactsRegex = /state: ['"]([A-Z]{2})['"],/g;

const allStates = [];
let match;

// Extract all states
while ((match = statesRegex.exec(fileContent)) !== null) {
  const statesStr = match[1];
  const states = statesStr.match(/['"]([A-Z]{2})['"]/g).map(s => s.replace(/['"]/g, ''));
  allStates.push(...states);
}

// Extract all states with facts
const statesWithFacts = [];
while ((match = stateFactsRegex.exec(fileContent)) !== null) {
  statesWithFacts.push(match[1]);
}

console.log(`Total states (with duplicates): ${allStates.length}`);
console.log(`Unique states: ${new Set(allStates).size}`);
console.log(`States with facts: ${statesWithFacts.length}`);

// Create a set of unique states to handle duplicates properly
const uniqueStatesSet = new Set(allStates);
const uniqueStates = Array.from(uniqueStatesSet);

// Find states missing facts
const statesMissingFacts = uniqueStates.filter(
  state => !statesWithFacts.includes(state)
);

// Count states by occurrence (to detect duplicates)
const stateCounts = {};
allStates.forEach(state => {
  stateCounts[state] = (stateCounts[state] || 0) + 1;
});

const duplicateStates = Object.entries(stateCounts)
  .filter(([_, count]) => count > 1)
  .map(([state]) => state);

console.log('Duplicate states (belonging to multiple regions):', duplicateStates);

// Log all states for inspection
console.log('All states:', allStates.sort());
console.log('States with facts:', statesWithFacts.sort());

// Log missing states for easy identification
if (statesMissingFacts.length > 0) {
  console.log('States missing facts:', statesMissingFacts);
  console.log('States missing facts count:', statesMissingFacts.length);
  process.exit(1);
} else {
  console.log('All states have facts! Test passed.');
}