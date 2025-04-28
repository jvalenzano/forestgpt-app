/**
 * Unit test for verifying that all states have "Did You Know" facts
 * in the ForestRegionMap component.
 */

// Import the forestRegions data from the component file
import { forestRegions } from '../components/ForestRegionMap.js';

// Define types based on the component's interfaces
interface StateFactData {
  state: string;
  fact: string;
}

interface ForestRegion {
  id: string;
  name: string;
  description: string;
  states: string[];
  color: string;
  position: { x: number; y: number };
  stateFacts?: StateFactData[];
}

describe('ForestRegionMap States Data', () => {
  test('All states should have a corresponding "Did You Know" fact', () => {
    // Get all states from all regions
    const allStates: string[] = [];
    forestRegions.forEach((region: ForestRegion) => {
      region.states.forEach(state => {
        allStates.push(state);
      });
    });
    
    // Get all states that have facts
    const statesWithFacts: string[] = [];
    forestRegions.forEach((region: ForestRegion) => {
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