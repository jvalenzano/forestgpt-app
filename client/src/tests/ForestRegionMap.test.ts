/**
 * Unit test for verifying that all states have "Did You Know" facts
 * in the ForestRegionMap component.
 */

// Import the forestRegions data from the component file
// Since we're only testing the data, we don't need to import the entire component
import { forestRegions } from '../components/ForestRegionMap';

describe('ForestRegionMap States Data', () => {
  test('All states should have a corresponding "Did You Know" fact', () => {
    // Get all states from all regions
    const allStates: string[] = [];
    forestRegions.forEach(region => {
      region.states.forEach(state => {
        allStates.push(state);
      });
    });
    
    // Get all states that have facts
    const statesWithFacts: string[] = [];
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
    
    // Log missing states for easy identification if the test fails
    if (statesMissingFacts.length > 0) {
      console.log('States missing facts:', statesMissingFacts);
    }
    
    // Assert that all states have a corresponding fact
    expect(statesMissingFacts).toEqual([]);
    expect(allStates.length).toBe(statesWithFacts.length);
  });
});