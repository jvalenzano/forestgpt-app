import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the regions of the US Forest Service
interface ForestRegion {
  id: string;
  name: string;
  description: string;
  states: string[];
  color: string; // Tailwind color class
  position: { x: number; y: number }; // Relative position in the map (0-100)
}

const forestRegions: ForestRegion[] = [
  {
    id: 'northern',
    name: 'Northern Region (R1)',
    description: 'Covering forests and grasslands in Montana, northern Idaho, North Dakota, and northwestern South Dakota.',
    states: ['MT', 'ID', 'ND', 'SD'],
    color: 'bg-green-700',
    position: { x: 22, y: 18 }
  },
  {
    id: 'rocky-mountain',
    name: 'Rocky Mountain Region (R2)',
    description: 'Managing lands in Colorado, Kansas, Nebraska, South Dakota, and Wyoming.',
    states: ['CO', 'KS', 'NE', 'SD', 'WY'],
    color: 'bg-green-800',
    position: { x: 30, y: 30 }
  },
  {
    id: 'southwestern',
    name: 'Southwestern Region (R3)',
    description: 'Overseeing Arizona and New Mexico forests and grasslands.',
    states: ['AZ', 'NM'],
    color: 'bg-green-900',
    position: { x: 25, y: 55 }
  },
  {
    id: 'intermountain',
    name: 'Intermountain Region (R4)',
    description: 'Covering southern Idaho, Nevada, Utah, and western Wyoming.',
    states: ['ID', 'NV', 'UT', 'WY'],
    color: 'bg-green-600',
    position: { x: 15, y: 35 }
  },
  {
    id: 'pacific-southwest',
    name: 'Pacific Southwest Region (R5)',
    description: 'Managing all of California and Hawaii.',
    states: ['CA', 'HI'],
    color: 'bg-emerald-700',
    position: { x: 8, y: 40 }
  },
  {
    id: 'pacific-northwest',
    name: 'Pacific Northwest Region (R6)',
    description: 'Covering Oregon and Washington.',
    states: ['OR', 'WA'],
    color: 'bg-emerald-800',
    position: { x: 10, y: 20 }
  },
  {
    id: 'southern',
    name: 'Southern Region (R8)',
    description: 'Covering forests across 13 southern states and Puerto Rico.',
    states: ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'PR'],
    color: 'bg-teal-700',
    position: { x: 65, y: 60 }
  },
  {
    id: 'eastern',
    name: 'Eastern Region (R9)',
    description: 'Managing forests across 20 northeastern states.',
    states: ['CT', 'DE', 'IL', 'IN', 'IA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MO', 'NH', 'NJ', 'NY', 'OH', 'PA', 'RI', 'VT', 'WV', 'WI'],
    color: 'bg-teal-800',
    position: { x: 70, y: 25 }
  },
  {
    id: 'alaska',
    name: 'Alaska Region (R10)',
    description: 'Managing over 22 million acres in Alaska.',
    states: ['AK'],
    color: 'bg-teal-900',
    position: { x: 10, y: 10 }
  },
];

interface ForestRegionMapProps {
  isVisible: boolean;
  onClose: () => void;
}

const ForestRegionMap: React.FC<ForestRegionMapProps> = ({ isVisible, onClose }) => {
  const [selectedRegion, setSelectedRegion] = useState<ForestRegion | null>(null);

  const handleRegionClick = (region: ForestRegion) => {
    setSelectedRegion(region);
  };

  const handleClose = () => {
    setSelectedRegion(null);
    onClose();
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
            className="w-[90%] max-w-4xl bg-gradient-to-b from-green-950 to-black rounded-lg overflow-hidden shadow-xl p-6 border border-green-800"
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
              <div className="relative w-full md:w-2/3 h-[300px] map-container rounded-lg border border-green-900 overflow-hidden forest-element">
                <div className="leaf"></div>
                <div className="leaf"></div>
                <div className="leaf"></div>
                
                {/* Simplified US map outline SVG */}
                <svg
                  viewBox="0 0 800 450"
                  className="w-full h-full opacity-30"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M223,48L241,59L247,81L245,94L248,107L235,115L214,121L201,120L196,113L183,113L175,106L171,96L169,83L173,74L170,69L159,70L159,76L157,84L154,84L151,79L146,81L130,80L124,75L114,78L102,80L79,85L62,87L47,85L40,79L25,76L13,70L3,59L-3,47L-3,38L-1,33L3,27L9,25L16,23L23,23L30,24L38,23L44,19L49,13L56,9L63,8L70,4L77,2L86,1L96,1L105,3L113,7L119,9L125,8L135,7L143,8L147,13L153,17L159,20L166,20L172,21L180,29L186,36L192,36L198,40L204,43L212,42L218,44L223,48ZM80,446L83,442L88,440L95,439L103,440L108,444L111,448L109,452L103,455L97,456L90,456L85,454L80,451L78,446L80,446ZM144,429L140,427L136,424L131,419L128,413L127,407L128,401L130,397L134,395L137,397L141,399L144,403L147,407L149,412L149,417L148,421L146,425L144,429ZM179,423L182,420L185,418L189,417L194,417L198,419L201,422L203,426L202,431L200,434L196,437L191,439L186,438L182,436L179,433L177,428L179,423ZM236,414L237,409L240,405L243,402L248,401L252,401L257,402L260,406L262,410L262,415L260,419L256,422L252,423L247,423L242,421L239,418L236,414ZM285,409L287,404L290,400L293,397L297,396L301,397L305,398L309,402L310,406L310,411L308,416L305,419L301,421L296,421L291,420L287,418L285,414L285,409ZM336,401L345,391L350,385L356,381L363,379L368,380L372,383L374,388L373,394L370,399L365,402L359,406L353,409L347,410L342,409L338,406L336,401ZM371,387L378,381L381,378L387,373L392,370L399,370L408,370L414,372L415,375L410,378L405,380L393,381L385,381L378,382L374,384L371,387ZM435,369L433,361L432,353L433,346L437,341L441,339L447,339L452,341L457,345L461,349L464,354L464,358L461,361L456,363L451,364L445,367L440,369L435,369ZM478,358L475,347L475,337L481,325L486,317L493,311L500,310L507,312L512,316L516,321L518,328L517,334L514,340L510,344L504,348L499,351L493,353L488,357L484,359L478,358ZM525,341L521,334L520,328L519,317L523,308L526,304L534,301L541,300L547,302L554,308L557,317L557,324L554,330L550,336L545,339L540,340L533,342L527,342L525,341ZM570,335L569,326L568,320L572,312L576,305L582,301L588,299L595,302L603,306L611,312L617,316L622,320L623,326L621,333L614,334L607,335L599,335L590,336L580,336L574,335L570,335ZM745,192L747,189L751,187L755,186L759,188L762,191L763,196L760,199L756,199L752,199L748,197L746,195L745,192ZM757,251L753,249L750,246L749,242L749,238L751,233L754,230L758,228L762,227L766,227L770,229L773,232L775,235L775,239L774,243L771,247L767,250L764,250L761,252L757,251ZM630,262L632,257L636,255L640,254L644,255L647,257L648,260L650,265L649,268L646,271L642,273L638,273L634,271L631,267L630,262ZM658,251L658,246L659,240L662,236L667,234L672,234L677,236L680,240L682,244L682,249L681,254L677,258L673,260L668,261L663,259L660,256L658,251ZM688,244L687,236L691,229L696,222L703,218L710,217L716,217L722,219L726,222L728,228L726,234L723,239L718,243L711,247L701,247L694,247L689,246L688,244Z"
                    fill="url(#map-gradient)"
                    stroke="#2F4F40"
                    strokeWidth="3"
                  />
                  <defs>
                    <linearGradient id="map-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a4c29" />
                      <stop offset="100%" stopColor="#0e2817" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Clickable region dots */}
                {forestRegions.map((region) => (
                  <motion.button
                    key={region.id}
                    className={`absolute w-6 h-6 rounded-full ${region.color} flex items-center justify-center 
                    shadow-lg border border-white/40 hover:border-white transition-all z-10 region-marker`}
                    style={{
                      left: `${region.position.x}%`,
                      top: `${region.position.y}%`,
                    }}
                    onClick={() => handleRegionClick(region)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={region.name}
                  >
                    <span className="text-xs text-white font-bold">
                      {region.id === 'alaska' ? 'AK' : (region.id === 'pacific-southwest' ? 'CA' : '')}
                    </span>
                  </motion.button>
                ))}

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
              <div className="w-full md:w-1/3 bg-green-950/50 rounded-lg p-4 border border-green-800">
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
                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="text-xs font-semibold text-green-400 uppercase flex items-center">
                          <i className="fas fa-map-marker-alt mr-1"></i> States
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRegion.states.map((state) => (
                            <span
                              key={state}
                              className="inline-block px-2 py-1 text-xs bg-green-900 rounded-md"
                            >
                              {state}
                            </span>
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
              <p>The U.S. Forest Service manages 154 national forests and 20 grasslands across the country.</p>
              <p className="text-green-600/70 flex items-center justify-center">
                <i className="fas fa-info-circle mr-1"></i>
                Click on the pulsing markers to explore each Forest Service region
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForestRegionMap;