import { forestRegions } from './client/src/components/ForestRegionMap.js';

// Get all states from all regions
const allStates = [];
forestRegions.forEach(region => {
  region.states.forEach(state => {
    allStates.push(state);
  });
});

// Get all states that have facts
const statesWithFacts = [];
forestRegions.forEach(region => {
  if (region.stateFacts) {
    region.stateFacts.forEach(stateFact => {
      statesWithFacts.push(stateFact.state);
    });
  }
});

// Log the total states and states with facts for debugging
console.log(`Total states: ${allStates.length}`);
console.log(`States with facts: ${statesWithFacts.length}`);

// Find states missing facts
const statesMissingFacts = allStates.filter(
  state => !statesWithFacts.includes(state)
);

// Log missing states for easy identification
if (statesMissingFacts.length > 0) {
  console.log('States missing facts:', statesMissingFacts);
  console.log('States missing facts count:', statesMissingFacts.length);
  
  // Group missing states by region
  const missingStatesByRegion = {};
  forestRegions.forEach(region => {
    const missingInRegion = region.states.filter(
      state => statesMissingFacts.includes(state)
    );
    if (missingInRegion.length > 0) {
      missingStatesByRegion[region.name] = missingInRegion;
    }
  });
  
  console.log('Missing states by region:');
  Object.entries(missingStatesByRegion).forEach(([regionName, states]) => {
    console.log(`- ${regionName}: ${states.join(', ')}`);
  });
  
  process.exit(1);
} else {
  console.log('All states have facts! Test passed.');
}