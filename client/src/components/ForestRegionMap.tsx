import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the regions of the US Forest Service
interface StateFactData {
  state: string;
  fact: string;
}

interface ForestRegion {
  id: string;
  name: string;
  description: string;
  states: string[];
  color: string; // Tailwind color class
  position: { x: number; y: number }; // Relative position in the map (0-100)
  stateFacts?: StateFactData[]; // Interesting facts about states in this region
}

const forestRegions: ForestRegion[] = [
  {
    id: 'northern',
    name: 'Northern Region (R1)',
    description: 'Covering forests and grasslands in Montana, northern Idaho, North Dakota, and northwestern South Dakota.',
    states: ['MT', 'ID', 'ND', 'SD'],
    color: 'bg-amber-800',
    position: { x: 25, y: 18 },
    stateFacts: [
      {
        state: 'MT',
        fact: 'Montana is home to the Bob Marshall Wilderness Complex, spanning over 1.5 million acres, one of the largest wilderness areas in the continental United States.'
      },
      {
        state: 'ID',
        fact: 'Idaho\'s Clearwater National Forest contains old-growth cedar groves with trees over 3,000 years old, some of the oldest living organisms in the region.'
      },
      {
        state: 'ND',
        fact: 'The Dakota Prairie Grasslands in North Dakota is one of the largest publicly owned grasslands in the United States, featuring unique prairie ecosystems.'
      },
      {
        state: 'SD',
        fact: 'The Black Hills National Forest in South Dakota contains the famous Mount Rushmore and was the first forest reserve established in the state in 1897.'
      }
    ]
  },
  {
    id: 'rocky-mountain',
    name: 'Rocky Mountain Region (R2)',
    description: 'Managing lands in Colorado, Kansas, Nebraska, South Dakota, and Wyoming.',
    states: ['CO', 'KS', 'NE', 'SD', 'WY'],
    color: 'bg-yellow-100',
    position: { x: 30, y: 33 },
    stateFacts: [
      {
        state: 'CO',
        fact: 'Colorado has more land above 10,000 feet than any other state, with the Forest Service managing 11.3 million acres of high-elevation forests and alpine tundra.'
      },
      {
        state: 'KS',
        fact: 'The Cimarron National Grassland in Kansas was once part of the Dust Bowl and has been restored to showcase how proper land management can heal damaged ecosystems.'
      },
      {
        state: 'NE',
        fact: 'Nebraska\'s National Forest was established in 1902 as the nation\'s largest human-planted forest, created to address timber shortages on the Great Plains.'
      },
      {
        state: 'WY',
        fact: 'Wyoming\'s Bridger-Teton National Forest contains over 1.2 million acres of wilderness and is a critical habitat for the largest elk herd in North America.'
      }
    ]
  },
  {
    id: 'southwestern',
    name: 'Southwestern Region (R3)',
    description: 'Overseeing Arizona and New Mexico forests and grasslands.',
    states: ['AZ', 'NM'],
    color: 'bg-amber-600',
    position: { x: 23, y: 48 },
    stateFacts: [
      {
        state: 'AZ',
        fact: 'Arizona\'s Coconino National Forest contains the largest contiguous ponderosa pine forest in the world, spanning over 1.8 million acres.'
      },
      {
        state: 'NM',
        fact: 'New Mexico\'s Carson National Forest contains Wheeler Peak, the state\'s highest point at 13,161 feet, showcasing five different life zones from desert to alpine tundra.'
      }
    ]
  },
  {
    id: 'intermountain',
    name: 'Intermountain Region (R4)',
    description: 'Covering southern Idaho, Nevada, Utah, and western Wyoming.',
    states: ['ID', 'NV', 'UT', 'WY'],
    color: 'bg-yellow-200',
    position: { x: 17, y: 30 },
    stateFacts: [
      {
        state: 'ID',
        fact: 'The Sawtooth National Forest in Idaho contains over 700 alpine lakes and 40 peaks that rise above 10,000 feet in elevation.'
      },
      {
        state: 'NV',
        fact: 'Nevada\'s Humboldt-Toiyabe National Forest is the largest national forest in the contiguous 48 states, spanning over 6.3 million acres across mountains and high desert.'
      },
      {
        state: 'UT',
        fact: 'Utah\'s Ashley National Forest is home to Flaming Gorge, one of the most scenic reservoirs in America, with ancient rock formations dating back over 150 million years.'
      },
      {
        state: 'WY',
        fact: 'The Bridger Wilderness in Wyoming protects crucial watersheds that provide drinking water to over 1.5 million people in the western United States.'
      }
    ]
  },
  {
    id: 'pacific-southwest',
    name: 'Pacific Southwest Region (R5)',
    description: 'Managing all of California and Hawaii.',
    states: ['CA', 'HI'],
    color: 'bg-yellow-600',
    position: { x: 8, y: 37 },
    stateFacts: [
      {
        state: 'CA',
        fact: 'California\'s Sequoia National Forest contains some of the largest trees on Earth, including the General Sherman Tree, the largest tree by volume at 52,500 cubic feet.'
      },
      {
        state: 'HI',
        fact: 'Hawaii\'s tropical forests are home to more endangered species than any other state, with the Forest Service helping preserve over 55,000 acres of critical habitat.'
      }
    ]
  },
  {
    id: 'pacific-northwest',
    name: 'Pacific Northwest Region (R6)',
    description: 'Covering Oregon and Washington.',
    states: ['OR', 'WA'],
    color: 'bg-lime-200',
    position: { x: 11, y: 20 },
    stateFacts: [
      {
        state: 'OR',
        fact: 'Oregon\'s Deschutes National Forest contains Newberry National Volcanic Monument, featuring a 500-foot-deep obsidian flow - the largest in the United States.'
      },
      {
        state: 'WA',
        fact: 'Washington\'s Olympic National Forest receives nearly 150 inches of annual rainfall in some areas, making it home to the only temperate rainforest in the continental United States.'
      }
    ]
  },
  {
    id: 'southern',
    name: 'Southern Region (R8)',
    description: 'Covering forests across 13 southern states and Puerto Rico.',
    states: ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'PR'],
    color: 'bg-green-600',
    position: { x: 62, y: 48 },
    stateFacts: [
      {
        state: 'AL',
        fact: 'Alabama\'s Talladega National Forest is home to Cheaha Mountain, the highest point in the state at 2,413 feet, and contains significant old-growth longleaf pine ecosystems.'
      },
      {
        state: 'FL',
        fact: 'Florida\'s Ocala National Forest contains the largest contiguous sand pine scrub forest in the world, a unique ecosystem adapted to fire and drought.'
      },
      {
        state: 'GA',
        fact: 'Georgia\'s Chattahoochee-Oconee National Forest protects the headwaters of several major river systems that provide drinking water to millions across the Southeast.'
      },
      {
        state: 'TX',
        fact: 'Texas\'s National Forests are home to the endangered red-cockaded woodpecker, with intensive conservation efforts helping recover this iconic southern pine species.'
      }
    ]
  },
  {
    id: 'eastern',
    name: 'Eastern Region (R9)',
    description: 'Managing forests across 20 northeastern states.',
    states: ['CT', 'DE', 'IL', 'IN', 'IA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MO', 'NH', 'NJ', 'NY', 'OH', 'PA', 'RI', 'VT', 'WV', 'WI'],
    color: 'bg-yellow-400',
    position: { x: 70, y: 28 },
    stateFacts: [
      {
        state: 'MI',
        fact: 'Michigan\'s Hiawatha National Forest spans nearly one million acres between the shores of Lake Superior, Lake Michigan, and Lake Huron, with over 100 miles of shoreline.'
      },
      {
        state: 'MN',
        fact: 'Minnesota\'s Superior National Forest contains the Boundary Waters Canoe Area Wilderness, with over 1,200 miles of canoe routes and more than 1,000 lakes.'
      },
      {
        state: 'NH',
        fact: 'New Hampshire\'s White Mountain National Forest is home to Mount Washington, which holds the record for the highest wind speed ever recorded on Earth\'s surface at 231 mph.'
      },
      {
        state: 'WV',
        fact: 'West Virginia\'s Monongahela National Forest contains the highest point in the state and the headwaters of six major river systems, earning it the nickname "the birthplace of rivers."'
      }
    ]
  },
  {
    id: 'alaska',
    name: 'Alaska Region (R10)',
    description: 'Managing over 22 million acres in Alaska.',
    states: ['AK'],
    color: 'bg-green-900',
    position: { x: 12, y: 60 }, // Moved higher up on the map
    stateFacts: [
      {
        state: 'AK',
        fact: 'Alaska\'s Tongass National Forest is the largest national forest in the United States at 16.7 million acres and contains the world\'s largest intact temperate rainforest.'
      }
    ]
  },
];

interface ForestRegionMapProps {
  isVisible: boolean;
  onClose: () => void;
}

const ForestRegionMap: React.FC<ForestRegionMapProps> = ({ isVisible, onClose }) => {
  const [selectedRegion, setSelectedRegion] = useState<ForestRegion | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [mapHeight, setMapHeight] = useState<number>(300); // Default height - smaller for mobile
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fact, setFact] = useState<string | null>(null);
  // Store the starting point of drag and initial height
  const [startY, setStartY] = useState<number | null>(null);
  const [initialHeight, setInitialHeight] = useState<number | null>(null);

  const handleRegionClick = (region: ForestRegion) => {
    setSelectedRegion(region);
    setSelectedState(null); // Reset selected state when a new region is selected
    setFact(null); // Reset fact when a new region is selected
  };

  const handleStateClick = (state: string) => {
    setSelectedState(state);
    
    // Find the fact for this state in the selected region
    if (selectedRegion && selectedRegion.stateFacts) {
      const stateFact = selectedRegion.stateFacts.find(sf => sf.state === state);
      if (stateFact) {
        setFact(stateFact.fact);
      } else {
        setFact(null);
      }
    }
  };

  const handleClose = () => {
    setSelectedRegion(null);
    setSelectedState(null);
    setFact(null);
    onClose();
  };
  
  // Handle map resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setStartY(e.clientY);
    setInitialHeight(mapHeight);
  };
  
  const handleResizeEnd = () => {
    setIsDragging(false);
    setStartY(null);
  };
  
  
  const handleResize = (e: React.MouseEvent) => {
    if (isDragging && startY !== null && initialHeight !== null) {
      // Calculate the difference from the start position
      const diff = e.clientY - startY;
      
      // Apply the difference to the initial height
      // This allows both increasing and decreasing height
      const newHeight = Math.max(250, Math.min(500, initialHeight + diff)); // Lower max height for better mobile display
      setMapHeight(newHeight);
      
      // Prevent text selection during resize
      e.preventDefault();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-[95%] max-w-4xl bg-gradient-to-b from-green-950 to-black rounded-lg overflow-auto shadow-xl p-4 border border-green-800 max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-green-100 font-bold">
                U.S. Forest Service Regions
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-green-300 hover:text-white hover:bg-green-700 transition-colors"
                aria-label="Close map"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Map of US with clickable regions */}
              <div 
                className="relative w-full md:w-2/3 map-container rounded-lg border border-green-900 overflow-hidden forest-element" 
                style={{ height: `${mapHeight}px` }}
                onMouseMove={handleResize}
                onMouseUp={handleResizeEnd}
                onMouseLeave={handleResizeEnd}
              >
                <div className="leaf"></div>
                <div className="leaf"></div>
                <div className="leaf"></div>
                
                {/* Accurate US map base */}
                <svg 
                  viewBox="0 0 960 600" 
                  className="w-full h-full opacity-40"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="map-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a4c29" />
                      <stop offset="100%" stopColor="#0e2817" />
                    </linearGradient>
                  </defs>
                  
                  <g fill="url(#map-gradient)" stroke="#2F4F40" strokeWidth="1">
                    {/* Continental US */}
                    <path d="M232,342 l0.8,4.9 0.6,1.4 0.5,3.6 3.3,6.2 0.5,5.7 -0.9,3.2 -1.8,2.8 1,4.7 1.1,5.9 -0.6,3.9 -2.3,2.1 -1.5,7.1 2.2,3.4 0.3,2.8 -2.1,4 -3.9,0.8 -3.8,5.7 -0.8,5.2 0.5,2.1 2.5,5.5 1.7,1.5 1.7,1.5 0.6,1.7 0.9,2.7 2.9,1.4 3.1,-1.2 1.8,-4.4 0.8,-3.2 0.6,-0.8 -0.7,-4.5 -1.2,-4.3 -1.7,-1.8 1.9,-4.3 1.8,0.8 -0.8,6.3 0.1,2.1 3,2 0.1,1.4 -0.6,1.9 2.1,3.8 1.9,1.9 -0.5,2.3 0.3,3.4 -1.6,2.2 -3.2,1.2 -1.9,1.5 -0.4,2.1 0.6,1.7 -0.7,4 -1.2,1.3 -0.8,2.2 -2.5,1.3 1.7,3.8 3.3,3.8 2.4,3.6 2.8,3.5 2,1.9 2.1,1.9 2.4,0.5 3.3,1.5 1.4,1.8 0.4,3 2.6,1.5 1.9,4.5 2.3,2.5 2.5,-1.2 3,-2.9 3.3,-2.2 2.4,1.9 1.8,2.4 0.5,3.9 -2,3.2 -3.5,1.4 -5.2,3.5 -2.4,3.4 -0.8,2.7 -0.7,2.5 0.5,2.9 -3.7,5.3 -2.7,0.2 -3.5,-1.4 -5.2,0.1 -5.6,4.7 -0.8,2.1 0.3,2.9 -1.9,1.5 -3.2,1 -3.2,0.9 -2.5,1.8 -0.8,1.4 0.4,5.5 -1.6,3.6 -0.8,3.4 -3.2,3.9 -1.9,0.9 -0.1,4.7 1.9,2.7 -8.6,0.8 -8.8,0.8 -8.8,0.7 -9.2,0.5 -9.3,0.4 -9.2,0.3 -9.5,0.2 -9.9,0 -10,0 -10-0.1 -10-0.3 -10-0.4 -10.1-0.5 -10.1-0.7 -10.1-0.8 -10.1-0.9 -10.2-1.1 -10.2-1.2 -8.5-1.1 -9.7-1.4 -9.7-1.4 -9.7-1.6 -9.7-1.7 -9.7-1.8 -9.7-2 -9.7-2.1 -9.6-2.2 -9.6-2.4 -9.6-2.5 -9.6-2.6 -8.8-2.5 -4.8-1.5 0-5.2 1.9-13.9 17.9-1.6 17.9-2.1 10.3-1.3 17.4-2.4 17.3-2.6 16.9-2.8 6.2-1.2 6.3-1.2 2.4,5.5 4.6,4.2 3.8,4.9 3.7,5.2 5,4.3 3.1,5.5 4.7,4.4 3.5,5.3 2.9,4.3 2.8,3.5 -0.2,3.1 3,2.5 4.5,1.9 3,3.9 0.4,5 3.7,3.6 2.7,4.6 1.4,5.8 3.4,4.8 1.1,4.5 0.5,3.2 -1.3,2.5 1.7,3.8 2.2,4.7 -0.4,4.4 1.5,3.5 -0.5,3 2.6,2.3 3.1,3.7 1.5,5.2 -0.1,2.2 1.1,2.2 -2.3,4.6 0.6,2.1 2,3.7 -0.2,3.8 -1.8,4.1 0.1,1.7 2.2,3.7 z" />
                    <path d="M434,142 l-17.9,-5.8 -17.9,-6.3 -10.1,-3.6 -18.3,-7 -18.2,-7.1 -18.2,-7.6 -18.1,-8 -18,-8.4 -17.9,-8.7 -17.9,-9.1 -17.8,-9.5 -8.8,-4.8 -8.8,-4.9 -17.5,-10.3 -17.5,-10.6 -17.3,-11 -8.7,-5.7 -8.5,-5.8 -17,-12.2 -8.4,-6.1 -8.3,-6.3 -7.6,-6 3.2,-1.2 5.6,-1.9 9.6,-3 9.8,-2.7 9.9,-2.3 9.9,-2 10,-1.6 10,-1.3 10,-1 10,-0.7 10,0 10,-0.1 10,0.1 9.9,0.4 9.9,0.6 9.9,0.9 9.9,1.1 9.8,1.3 9.8,1.6 9.8,1.8 9.7,2 9.7,2.2 9.6,2.5 9.6,2.7 9.5,2.9 9.5,3.1 9.4,3.3 9.4,3.5 9.3,3.7 9.2,3.9 9.2,4.1 9.1,4.3 9,4.5 9,4.6 8.9,4.8 8.8,5 8.7,5.2 8.6,5.4 8.5,5.5 8.5,5.7 8.3,5.9 8.3,6 8.1,6.2 8.1,6.3 7.9,6.5 7.8,6.6 0,7.1 -7,0 -7.2,9.9 z" />
                    <path d="M634,191 l-10.4,-9.1 -10.5,-8.9 -10.6,-8.7 -10.7,-8.5 -10.8,-8.3 -10.9,-8 -11,-7.8 -11.1,-7.6 -11.1,-7.3 -11.2,-7 -11.3,-6.8 -11.4,-6.5 -11.5,-6.2 -11.6,-6 -11.6,-5.7 -11.7,-5.4 -11.8,-5.1 -11.9,-4.9 -11.9,-4.6 -12,-4.3 -12,-4 -12.1,-3.7 -12.2,-3.4 -12.2,-3.1 -12.3,-2.8 -12.3,-2.5 -12.3,-2.2 -12.4,-1.9 -12.5,-1.6 -12.5,-1.2 -12.5,-0.9 -12.6,-0.6 -12.6,-0.3 -12.6,0 -12.6,0.3 -12.6,0.6 -12.6,0.9 -12.6,1.3 -12.5,1.6 -12.5,1.9 -12.5,2.2 -12.4,2.5 -12.4,2.8 -12.3,3.2 -12.2,3.4 -12.2,3.7 -12.1,4 -12,4.3 -11.9,4.6 -11.9,4.9 -11.8,5.2 -11.7,5.5 -4.2,2 7.1,6.1 8.5,6.9 8.8,6.5 8.9,6.4 18,11.9 18.3,11.3 18.5,10.7 18.7,10.1 18.8,9.5 18.9,9 19.1,8.4 19.2,7.8 19.3,7.2 10.1,3.5 18.1,6 18.3,5.6 9.1,2.7 6.8,1.7 -0.4,-4.1 1.3,-5.7 3.3,-3.8 2.8,-0.8 0.3,-3.2 -0.2,-3.5 3.3,-5.4 -0.8,-2.8 0.3,-3.2 3.4,-4.1 0.8,-4.6 0.1,-3.9 2.6,-0.7 2.8,-0.4 -0.1,-3.7 3.5,-3.3 2,-3.8 4.3,-2.1 2.3,-1.2 2,-1.1 3.1,-3.2 3.8,-2.7 3.4,-0.3 3.3,1.5 4.4,-0.4 2.6,0.6 2.5,-2.7 1.7,-2.7 3.9,-1.2 1.8,-1.2 1.6,0.1 1.7,-3.4 3.7,-3.2 0.3,-3.3 -0.9,-1.1 1.4,-3.8 0.9,-2.1 3.7,-1.5 1.5,-1.9 -0.4,-4.9 1.3,-4.1 0.4,-6.4 -1.9,-5.4 -1.5,-5.6 2.1,-4.6 -0.8,-4.6 -2.9,-7.5 -2.6,-10.3 -0.2,-3.5 -0.7,-3.5 -3.4,-6.7 0.8,-6.4 -0.8,-6.5 -2,-11.5 -0.6,-3.6 -1.9,-4.5 -2.8,-5 -0.8,-5.5 -2.5,-3 -2.6,-10 -2.4,-4.6 -4.9,-6.8 -0.5,-4.5 -2.2,-4.5 -5.7,-4.1 -2.8,-4.1 -0.7,-3.7 -2.6,-3.5 -3.3,-2.5 -4.4,-1.5 -5.7,0.8 -5.2,-1.8 -4.8,-2.3 -3.8,-2.9 -6.3,-2.9 -3.4,-3.8 -4.2,-0.5 -3.6,-5.4 -4.3,-1 z" />
                    <path d="M802,149 l-4.9,-1.8 -4.9,-1.6 -4.9,-1.4 -5,-1.1 -5,-0.9 -5,-0.7 -5.1,-0.4 -5.1,-0.2 -5.2,0 -5.2,0.2 -5.2,0.5 -5.2,0.7 -5.3,0.9 -5.3,1.1 -5.3,1.4 -5.3,1.6 -5.3,1.8 -5.3,2.1 -5.3,2.3 -5.3,2.5 -5.2,2.8 -5.2,3 -5.2,3.2 -5.2,3.4 -5.1,3.6 -5.1,3.8 -5,4 -5,4.3 -4.9,4.5 -4.9,4.7 -4.8,4.9 -4.8,5.1 -4.7,5.3 -4.6,5.5 -4.6,5.6 -4.4,5.9 -1.9,2.7 -2.4,10.8 -0.4,11.6 1.5,11.4 3.5,10.4 5.6,8.6 7.6,5.9 8.4,3.4 9.2,1 9.8,-1.2 10.4,-3.4 10.8,-5.5 11.1,-7.5 10.6,-8.6 10,-9.6 9.5,-10.6 8.9,-11.6 8.3,-12.5 7.7,-13.4 1.3,-2.3 0.8,-2.2 1.3,-5.2 0.8,-5.3 0.4,-5.5 -0.1,-5.5 -0.5,-5.5 -1,-5.6 -1.4,-5.5 -1.9,-5.5 -2.4,-5.4 -2.8,-5.3 -3.2,-5.2 -3.7,-5.1 -4.1,-5 -4.6,-4.8 z" />
                    <path d="M681,425 l-0.2,-1.3 -1.4,0.6 -2.3,-1.2 -2.2,-3.9 -0.8,-3.3 -0.7,-1.8 -1,-0.6 -3.1,1 -4.5,1.2 -2.5,-0.1 -2.2,-1.8 -2.5,-3.9 -3,-2.7 -1.7,-0.4 -1.8,0.5 -3.3,1.9 -1.7,0.6 -1.4,-0.8 -0.5,-1.3 1,-1.9 2.2,-1.8 2.5,-1.5 1.9,-0.5 -0.3,-2.3 -3.8,0.8 -3.7,1.3 -3,1.4 -1.8,0.3 -1.4,-1.3 -3.8,-4.9 -0.8,-1.5 0.3,-1.6 1.9,-1 3.2,-0.9 3.5,-1.1 3,-1.6 2.8,-2.3 2.6,-2.8 2.3,-3.5 2.6,-2.9 -0.2,-2.7 -3.2,-0.6 -1.4,-1.6 -1.2,-2.5 -1.6,-2.2 -2.5,-0.8 -1.6,-2.8 0.3,-3.5 -1.4,-2.7 0.9,-5.4 1.4,-4.5 5.5,0.2 7.6,0.6 -0.1,-4.4 -1.7,-1.5 -3.4,-0.5 -1.3,-1.4 -3.6,0.8 -0.1,-3.1 1.6,-3.6 3.9,-1.4 6.4,-0.3 6.1,-1.9 0.3,-1.9 -1.7,-5.1 0.2,-2.1 1.7,-1.8 1.6,-2.5 0,-5.3 -1.5,-4 -8.4,-9.8 -0.6,-3.5 -0.6,-2.7 0.5,-2.3 -2.7,-5.1 -4.2,-3.5 -4,-2.2 -2.6,-2.2 -3.2,-5.9 -0.6,-3.5 0.9,-1.4 -1.4,-7.1 -3.2,-3.8 -1.6,-4.8 -0.3,-3.4 -2.9,-5.1 -5,-5.5 2.1,-2.2 3,-2.7 -0.2,-2.3 -4.7,-1.2 -5.1,1.5 -4.5,-0.3 -2.1,0.1 -4.5,-2.7 -4.5,-0.7 -2.6,-1.5 -3.2,-3.1 -4.2,-2.5 -4.7,-2.3 -2.6,-0.7 -1.8,-1.5 -3,-4.8 -1.4,-1.4 -2.2,0.3 -1,1 -4.3,0.6 -3.8,-1.3 -4.9,-3.2 -3.7,-1.7 -3.5,0.7 -5.4,2 -4.1,0.3 -3.2,-0.3 -3.6,-1.9 -2.6,-2.3 -3.1,-1.5 -5.6,-1.3 -1.9,0.2 -7.1,2.2 -4.6,-0.1 -6,-2.2 -3.5,-0.3 -2.8,1 -4.7,0 -7.7,-2.5 -6.5,-3.3 -2,-2.5 2.9,0.8 2.3,-0.2 3.8,-1.9 1.3,-1.8 1.8,-4.4 -2.4,-1.9 -2.5,-0.1 -1.6,-2.5 0.5,-2.1 2,-1.8 -0.9,-2.8 -2.3,-3.9 -2.9,-1.5 -1.5,-4.5 -3.2,-3.7 -2.4,-4.9 -2.4,-7.7 -0.5,-4.8 0,-5.5 -3.1,-8.9 2.8,-1.6 2.9,-2.5 0.9,-1.5 -1.5,-4.5 0.1,-4.2 1.3,-3.1 2.5,-2.1 1.3,-1.7 1.5,-3.9 1.4,-1.2 1.8,0.6 2.1,-0.2 1.3,-0.7 10.8,5.1 10.7,4.9 10.6,4.7 10.5,4.5 10.4,4.3 10.3,4.1 10.2,3.9 10.1,3.7 10,3.6 9.9,3.4 9.8,3.2 9.7,3 9.6,2.8 9.5,2.6 9.4,2.5 9.3,2.3 9.2,2.1 9.1,1.9 9,1.7 8.9,1.6 8.8,1.4 8.7,1.2 8.6,1 8.5,0.8 8.3,0.7 8.2,0.5 8.1,0.3 8,0.1 7.9,-0.1 7.8,-0.3 7.7,-0.5 7.5,-0.6 7.4,-0.8 7.3,-1 7.2,-1.2 7,-1.4 6.9,-1.5 6.8,-1.7 6.7,-1.9 6.5,-2.1 6.4,-2.3 6.2,-2.4 6.1,-2.6 6,-2.8 5.8,-3 5.7,-3.1 5.6,-3.3 5.4,-3.4 5.2,-3.6 5.1,-3.8 5,-4 4.8,-4.1 4.6,-4.3 4.5,-4.4 4.3,-4.6 4.1,-4.7 4,-4.9 3.8,-5.1 3.6,-5.2 3.4,-5.3 3.2,-5.5 3,-5.6 2.9,-5.8 2.7,-5.9 2.5,-6 2.3,-6.2 2.1,-6.3 1.9,-6.4 1.8,-6.5 1.6,-6.7 1.4,-6.8 1.2,-6.9 1,-7 0.8,-7.1 0.6,-7.2 0.4,-7.3 0.2,-7.4 0,-7.5 z" />
                    <path d="M592,371 l1.3,4.9 5.3,2.9 0.8,3.1 -1.8,3.6 2.2,4.5 3.2,0.9 -0.1,4.7 4.2,1.6 3.7,6.8 -0.3,3.9 2.7,0.2 2.3,3.5 -1.6,4.3 -0.5,4.1 1.4,3.8 1.5,0.6 0.4,3.7 -1.9,3.9 -0.1,3.5 -1,3.9 0.8,5.2 -1.5,4.9 -0.7,4.4 -2.5,4.1 -0.6,5.2 -2.4,4.4 -2.4,5.5 0.7,2.9 0.7,6.9 -3.8,2.2 0.1,3.8 -2,3.5 -1.7,3.1 -2.6,2.5 -1.8,3.5 1.9,4.5 -2.6,6.1 0.4,5.1 1.5,2.1 -1.4,1.4 -3.2,1.3 -0.4,2.1 -1.7,2.2 -3,1.3 -3.5,4.4 -0.7,2.9 -2.5,0.3 -2.8,-2.9 -3.5,0.8 -0.5,2.2 -3.2,0.6 -3.2,2.3 -2.6,2.5 -0.7,3.6 -1.8,2.6 -0.9,3.8 -0.9,2.5 1.5,4.3 -0.2,1.9 -2.3,1.6 -2,3.3 -1.5,2.8 -2.4,1.3 -2.6,-0.3 -1.7,2 -2.8,-2.1 -3.4,1.2 -1.4,4.8 1.8,1.7 0.4,2.9 -3.4,1.5 -1.5,2.9 -2.9,1.3 -2.8,1.7 -2.1,2 -2,1.8 -1.9,0.5 -4.5,2.4 -4.2,3.3 -3.4,0.9 -2.3,2.5 0.4,2.9 1.5,1.8 1.4,2.8 2.1,2.7 0,2.2 -1.3,1.5 -2.3,3.7 -2.1,1.1 -0.8,1.9 0.8,3.1 -0.8,3.1 -2.9,1.3 -1,1.8 -3.2,0.9 -1.8,1.8 -3.3,1.7 -1.4,2 -2.9,1.1 -3.7,3.4 -2.7,0.6 -0.8,2.2 0.8,3.2 -3.3,1.6 -1.9,1.1 -3.3,3.2 -2.5,4.2 -1.6,5.1 -0.8,3.1 -1.6,2.9 -0.8,3.1 -0.7,2.9 -0.1,3.3 -0.9,2.2 -1.8,2.4 -3.3,1.5 -0.8,1.2 0.3,1.9 -2.2,2.7 0.7,3.8 -1.8,2.1 -3,4.2 -2.8,0.8 -3.1,-1.9 -1.4,0.3 -1.1,1.2 -1.4,3.7 -2.9,2.4 -2.8,1.1 -1.1,0.9 -0.4,2.6 -2.1,0.3 -2.3,2.8 -2.4,0.9 -1.7,1.4 -1.8,0.5 -1.4,1.6 -0.9,3.9 -1.3,1.7 -1,3.7 -2.7,3.8 -2,1.1 -2.2,2.1 -0.9,4.5 1.3,3.2 -1.5,4.1 -1.6,6.1 -1.3,2.7 -2.9,0.8 -2.2,2.9 -2.5,2.8 -3.1,1.8 -2.1,2.3 -0.9,3.1 -2.2,4 -1.1,2.8 -2.7,2 -3,0.6 -1.2,0.7 -1.4,2.5 -2.6,0.1 -1.9,-1.8 -2,-0.7 -2.3,1.3 -2,2.5 -2.6,1.7 -1.8,-0.1 -1.4,-1.7 -1.7,0.3 -2.9,1.7 -3.4,4.2 -3.5,1.7 -1.2,1.3 -2.2,3.4 -1.8,1.2 -2.5,0.9 -2.7,1.4 -3.2,2.6 -2.4,0.8 -2.5,-0.8 -4.4,0.6 -4.2,1.6 -4.1,2.6 -3.7,2.1 -3.6,0.5 -3.6,0.1 -3.7,1.2 -4,2.9 -4,1.8 -3,1.9 -1.8,0.9 -3.8,0.7 -2.5,1.4 -2.1,2.1 -2.1,0.9 -2.6,0.4 -4.9,1.9 -3.2,0.2 -2.5,0.2 -2.8,1.9 -1.6,0.8 -2.7,0.1 -3.8,1.8 -0.5,2 -1.7,0.2 -2.3,-1 -3.7,0.3 -1.5,0.4 -1,0.9 -0.2,1.7 -5.7,0.4 -5.6,0.2 -5.7,0 -5.6,-0.2 -5.6,-0.4 -5.6,-0.6 -5.6,-0.8 -5.6,-1 -5.6,-1.2 -5.6,-1.4 -5.5,-1.6 -5.5,-1.8 -5.5,-2 -5.4,-2.2 -5.4,-2.4 -5.4,-2.6 -5.3,-2.8 -5.3,-3 -5.3,-3.2 -5.2,-3.4 -5.2,-3.6 -5.1,-3.8 -5.1,-4 -5,-4.2 -5,-4.4 -4.9,-4.6 -4.9,-4.8 -4.8,-5 -4.7,-5.2 -4.7,-5.4 -4.6,-5.5 -4.5,-5.7 -4.5,-5.9 -4.4,-6.1 -4.4,-6.3 -4.2,-6.4 -4.2,-6.6 -4.1,-6.8 -4,-6.9 -4,-7.1 -3.9,-7.2 -3.8,-7.4 -3.7,-7.5 -3.6,-7.7 -3.5,-7.8 -3.5,-7.9 -3.3,-8.1 -3.3,-8.2 -3.2,-8.3 -3.1,-8.5 -3,-8.6 -2.9,-8.7 -2.8,-8.8 -2.7,-8.9 -2.6,-9.1 -2.5,-9.1 -2.4,-9.3 -2.3,-9.4 -2.2,-9.5 -2.1,-9.6 -2,-9.7 -1.9,-9.8 -1.8,-9.9 -1.8,-10 -1.6,-10.1 -1.5,-10.2 -1.4,-10.3 -1.3,-10.4 -1.2,-10.5 -1.1,-10.5 -1,-10.6 -0.9,-10.7 -0.7,-10.8 -0.6,-10.8 -0.5,-10.9 -0.4,-11 -0.3,-11 -0.2,-11.1 -0.1,-11.1 0,-11.2 0.2,-11.2 0.2,-11.2 0.4,-11.3 z" />

                    {/* Alaska */}
                    <path d="M44,494 c0,0 2.4,-1.3 2.2,-1.9 -0.2,-0.6 1.6,-2.2 1.6,-2.2 l1.3,1.1 3,0.3 0.6,1 0.2,2.4 2.6,2.2 3.9,1.1 -0.3,1.4 1.8,1.5 0.4,1.9 -1.8,0.6 -1.4,2.1 -2.6,0.3 -0.4,-1.5 -2.8,-2.6 -3.4,-0.9 -1.5,-1.4 -2.8,-0.5 -0.6,-1.6 z" />
                    <path d="M26,504 c0,0 0.9,-2.3 2.1,-2.6 1.2,-0.3 3.5,-0.9 3.5,-0.9 l1.5,-1.1 2.1,0.3 1,2 3.2,0.1 1.1,1.3 0.1,3.4 -0.4,2.5 -0.8,2.2 -1.7,1.3 -2.7,-2.9 -2.5,-0.8 -1.9,-0.1 -3.1,-1.6 -1.4,-1.2 z" />
                    <path d="M75,490 c0,0 1.9,-1.8 2.5,-1.8 0.6,0 2.5,-0.3 2.5,-0.3 l1,1.3 -0.8,1.5 -1.2,2.5 -0.5,2.2 -1.7,0.6 -1.4,-1.1 -0.7,-2.1 z" />
                    <path d="M58,489 c0,0 1.2,0.5 1.4,1.2 0.2,0.7 1.3,1.7 1.3,1.7 l2.4,1.3 1,1.5 -1.3,1.6 -3,0.7 -1.9,-0.2 -2.4,-1.1 -0.5,-1.5 -0.3,-1.6 2,-1.3 z" />
                    <path d="M78,524 c0,0 1.8,-2.3 2.6,-2.3 0.8,0 3.1,-0.5 3.1,-0.5 l3.3,-0.9 1.3,0.8 -0.3,1.5 -2,1.5 -3.9,2.1 -1.9,-0.1 -1.8,-0.7 z" />
                    <path d="M94,517 c0,0 1.7,-2.2 2.5,-2.6 0.8,-0.4 2.5,0.5 2.5,0.5 l-0.8,3.2 -0.7,3.5 -0.8,0.5 -2,-1.1 -0.6,-1.6 z" />
                    <path d="M101,534 c0,0 2.7,-2.8 3.5,-2.9 0.8,-0.1 1.9,0.3 1.9,0.3 l0.9,0.9 0.2,1.6 -1.1,1.9 -2.3,1.1 -1.6,-0.9 -1.1,-0.8 z" />
                    <path d="M99,542 c0,0 0.9,-2.3 1.7,-2.6 0.8,-0.3 2.1,-0.1 2.1,-0.1 l1.9,1.1 0.7,1.9 -0.4,1.8 -2.1,1.2 -2,-0.1 -1.6,-1.1 z" />
                    <path d="M90,529 c0,0 2.3,-1.3 3.1,-1.3 0.8,0 2.5,1.3 2.5,1.3 l0.1,1.6 -1.7,2.5 -2.8,0.3 -1.3,-1.3 z" />
                    <path d="M69,554 c0,0 2.5,-0.9 3.3,-0.7 0.8,0.2 3,1.6 3,1.6 l-0.1,2.2 -1.2,1.9 -2.9,0.5 -2,-0.9 -0.7,-2.1 z" />

                    {/* Hawaii */}
                    <path d="M181,514 c0,0 -0.8,-1.4 -0.9,-2.1 -0.1,-0.7 0.2,-2.1 0.2,-2.1 l1.5,-0.6 1.2,0.6 0.7,1.5 -0.7,1.7 -0.9,1.1 z" />
                    <path d="M172,521 c0,0 1.3,-1.1 2,-1.3 0.7,-0.2 2.3,0.1 2.3,0.1 l1,1.3 -0.5,1.3 -1.2,1.1 -1.2,0.5 -1.4,-0.6 -0.9,-0.9 z" />
                    <path d="M163,525 c0,0 1.1,-1.5 1.8,-1.7 0.7,-0.2 2.6,-0.2 2.6,-0.2 l0.7,1.3 -0.9,2.1 -2.2,0.3 -1,-0.6 z" />
                    <path d="M154,525 c0,0 1.8,-1.4 2.5,-1.4 0.7,0 1.8,0.8 1.8,0.8 l0.5,0.7 -1.1,1.7 -1.3,0.4 -1.5,-0.8 z" />
                    <path d="M145,526 c0,0 2.2,-1.1 2.9,-1 0.7,0.1 1.7,1.4 1.7,1.4 l-0.6,1.8 -2.5,0.3 -1.6,-1.2 z" />
                  </g>
                </svg>
                
                {/* Forest Service regions overlay - matching the colors from the reference image */}
                <svg
                  viewBox="0 0 960 600"
                  className="w-full h-full absolute top-0 left-0 opacity-30 z-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g>
                    {/* Northern Region (R1) - Amber/Brown */}
                    <path d="M232,142 l20,20 36,18 10,15 -10,25 -5,30 -15,10 -20,5 -15,-15 -25,0 -10,20" 
                          fill="#b08850" stroke="#2F4F40" strokeWidth="1" />
                          
                    {/* Rocky Mountain Region (R2) - Light Yellow */}
                    <path d="M232,250 l40,20 15,30 15,45 -5,25 -25,15 -20,5 -20,-10 -15,-25 -20,-30"
                          fill="#f5f1e0" stroke="#2F4F40" strokeWidth="1" />
                          
                    {/* Southwestern Region (R3) - Amber */}
                    <path d="M227,400 l30,10 25,20 10,30 -5,25 -20,10 -25,-5 -15,-20 -10,-30"
                          fill="#b08850" stroke="#2F4F40" strokeWidth="1" />
                          
                    {/* Intermountain Region (R4) - Pale Yellow */}
                    <path d="M152,142 l40,20 25,40 5,50 -15,40 -30,15 -30,-5 -20,-25 -10,-40"
                          fill="#f7f4cc" stroke="#2F4F40" strokeWidth="1" />
                          
                    {/* Pacific Southwest Region (R5) - Yellow/Gold */}
                    <path d="M43,250 l30,30 40,20 25,40 0,50 -25,20 -40,-10 -25,-40 -5,-50"
                          fill="#FFBF00" stroke="#2F4F40" strokeWidth="1" />
                          
                    {/* Pacific Northwest Region (R6) - Sage Green */}
                    <path d="M43,142 l60,30 30,40 5,40 -30,20 -45,-10 -20,-40 0,-50"
                          fill="#d8e4bc" stroke="#2F4F40" strokeWidth="1" />
                          
                    {/* Southern Region (R8) - Bright Green */}
                    <path d="M297,320 l80,30 120,20 60,-15 40,-30 30,-40 10,-50 -20,-45 -50,-30 -80,-10 -60,10 -40,30 -30,40 -20,45 -10,50"
                          fill="#70A65F" stroke="#2F4F40" strokeWidth="1" />
                          
                    {/* Eastern Region (R9) - Gold/Yellow */}
                    <path d="M393,95 l80,30 60,40 30,45 10,50 -10,45 -30,35 -60,20 -80,-5 -60,-30 -40,-45 -10,-50 10,-50 40,-40"
                          fill="#f7ce46" stroke="#2F4F40" strokeWidth="1" />
                          
                    {/* Alaska Region (R10) - Dark Green */}
                    <path d="M44,494 c0,0 2.4,-1.3 2.2,-1.9 -0.2,-0.6 1.6,-2.2 1.6,-2.2 l1.3,1.1 3,0.3 0.6,1 0.2,2.4 2.6,2.2 3.9,1.1 -0.3,1.4 1.8,1.5 0.4,1.9 -1.8,0.6 -1.4,2.1 -2.6,0.3 -0.4,-1.5 -2.8,-2.6 -3.4,-0.9 -1.5,-1.4 -2.8,-0.5 -0.6,-1.6 z"
                          fill="#2e5e38" stroke="#2F4F40" strokeWidth="1" />
                  </g>
                </svg>


                {/* Clickable region dots */}
                {forestRegions.map((region) => (
                  <motion.button
                    key={region.id}
                    className={`absolute w-8 h-8 rounded-full ${region.color} flex items-center justify-center 
                    shadow-lg border-2 border-white/70 hover:border-white transition-all z-10 region-marker`}
                    style={{
                      left: `${region.position.x}%`,
                      top: `${region.position.y}%`,
                    }}
                    onClick={() => handleRegionClick(region)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={region.name}
                  >
                    <span className="text-xs text-gray-800 font-bold">
                      {region.id === 'northern' ? 'R1' : 
                       region.id === 'rocky-mountain' ? 'R2' : 
                       region.id === 'southwestern' ? 'R3' : 
                       region.id === 'intermountain' ? 'R4' : 
                       region.id === 'pacific-southwest' ? 'R5' : 
                       region.id === 'pacific-northwest' ? 'R6' : 
                       region.id === 'southern' ? 'R8' : 
                       region.id === 'eastern' ? 'R9' : 'R10'}
                    </span>
                  </motion.button>
                ))}

                {/* Resize handle */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center cursor-ns-resize bg-gradient-to-t from-green-950/80 to-transparent"
                  onMouseDown={handleResizeStart}
                >
                  <div className="w-24 h-1 bg-green-500/60 rounded-full"></div>
                  <span className="absolute text-green-300 text-xs font-medium">
                    <i className="fas fa-arrows-alt-v mr-1"></i>
                    Resize
                  </span>
                </div>

                {/* Region highlight if selected */}
                {selectedRegion && (
                  <motion.div
                    className={`absolute w-10 h-10 ${selectedRegion.color} rounded-full opacity-50`}
                    style={{
                      left: `${selectedRegion.position.x}%`,
                      top: `${selectedRegion.position.y}%`,
                      transform: 'translate(-25%, -25%)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 2.5, opacity: 0.2 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </div>

              {/* Region information sidebar */}
              <div className="w-full md:w-1/3 overflow-y-auto bg-green-950/50 rounded-lg p-4 border border-green-800 max-h-[40vh] md:max-h-none"
                   style={{ height: `${mapHeight}px` }}>
                {selectedRegion ? (
                  <div className="text-green-100">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center mr-2 forest-element">
                        <i className="fas fa-tree text-green-200"></i>
                        <div className="leaf"></div>
                      </div>
                      <h3 className="text-lg font-bold">{selectedRegion.name}</h3>
                    </div>
                    <p className="text-sm mb-3">{selectedRegion.description}</p>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-green-400 uppercase flex items-center">
                          <i className="fas fa-map-marker-alt mr-1"></i> States
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRegion.states.map((state) => (
                            <button
                              key={state}
                              className={`inline-block px-2 py-1 text-xs rounded-md cursor-pointer transition-all ${
                                selectedState === state 
                                  ? 'bg-green-600 border border-green-400 shadow-md scale-110' 
                                  : 'bg-green-900 hover:bg-green-800 hover:scale-105 hover:shadow-sm'
                              }`}
                              onClick={() => handleStateClick(state)}
                            >
                              {state}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-green-400 uppercase flex items-center">
                          <i className="fas fa-seedling mr-1"></i> Key Features
                        </h4>
                        <ul className="text-xs mt-1 pl-4 space-y-1 list-disc text-green-200">
                          <li>Multiple national forests and grasslands</li>
                          <li>Diverse recreation opportunities</li>
                          <li>Important watershed protection</li>
                        </ul>
                      </div>
                      
                      {/* Did you know section */}
                      {fact && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: 20, height: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="mt-4 bg-green-900/40 border border-green-800/80 rounded-lg p-3 shadow-lg"
                        >
                          <div className="flex gap-2">
                            <motion.div 
                              className="flex-shrink-0 text-yellow-300 text-lg mt-1"
                              animate={{ 
                                opacity: [0.7, 1, 0.7],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 2,
                                ease: "easeInOut"
                              }}
                            >
                              <i className="fas fa-lightbulb"></i>
                            </motion.div>
                            <div>
                              <h5 className="font-bold text-yellow-200 text-sm">Did you know?</h5>
                              <p className="text-green-100 text-xs mt-1">{fact}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-green-300 h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center mb-3 forest-element">
                      <i className="fas fa-map-marked-alt text-xl text-green-200"></i>
                      <div className="leaf"></div>
                      <div className="leaf"></div>
                    </div>
                    <p className="text-center">Click on a region marker to view information about that U.S. Forest Service region.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-green-500 text-center space-y-1">
              <p>The U.S. Forest Service is divided into 9 regions (R1-R9) plus Alaska (R10), managing 155 national forests and 20 grasslands.</p>
              <p className="text-green-600/70 flex items-center justify-center">
                <i className="fas fa-info-circle mr-1"></i>
                Click on the region markers (R1-R10) to explore details about each Forest Service region
              </p>
              <p className="text-yellow-500 flex items-center justify-center font-medium shadow-sm px-2 py-1 bg-green-900/40 rounded-md border border-green-800/30">
                <i className="fas fa-lightbulb mr-1 text-yellow-400"></i>
                Click on state abbreviations to discover interesting forest trivia
              </p>
              <p className="text-blue-400/80 flex items-center justify-center mt-1 text-[11px]">
                <i className="fas fa-map-marked mr-1"></i>
                <a 
                  href="https://www.fs.usda.gov/mapfinder/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-blue-300 transition-colors"
                >
                  Visit the official Forest Service Map Finder for detailed maps
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForestRegionMap;