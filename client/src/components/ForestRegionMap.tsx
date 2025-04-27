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
    color: 'bg-amber-800',
    position: { x: 25, y: 18 }
  },
  {
    id: 'rocky-mountain',
    name: 'Rocky Mountain Region (R2)',
    description: 'Managing lands in Colorado, Kansas, Nebraska, South Dakota, and Wyoming.',
    states: ['CO', 'KS', 'NE', 'SD', 'WY'],
    color: 'bg-yellow-100',
    position: { x: 30, y: 33 }
  },
  {
    id: 'southwestern',
    name: 'Southwestern Region (R3)',
    description: 'Overseeing Arizona and New Mexico forests and grasslands.',
    states: ['AZ', 'NM'],
    color: 'bg-amber-600',
    position: { x: 23, y: 48 }
  },
  {
    id: 'intermountain',
    name: 'Intermountain Region (R4)',
    description: 'Covering southern Idaho, Nevada, Utah, and western Wyoming.',
    states: ['ID', 'NV', 'UT', 'WY'],
    color: 'bg-yellow-200',
    position: { x: 17, y: 30 }
  },
  {
    id: 'pacific-southwest',
    name: 'Pacific Southwest Region (R5)',
    description: 'Managing all of California and Hawaii.',
    states: ['CA', 'HI'],
    color: 'bg-yellow-600',
    position: { x: 8, y: 37 }
  },
  {
    id: 'pacific-northwest',
    name: 'Pacific Northwest Region (R6)',
    description: 'Covering Oregon and Washington.',
    states: ['OR', 'WA'],
    color: 'bg-lime-200',
    position: { x: 11, y: 20 }
  },
  {
    id: 'southern',
    name: 'Southern Region (R8)',
    description: 'Covering forests across 13 southern states and Puerto Rico.',
    states: ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'PR'],
    color: 'bg-green-600',
    position: { x: 62, y: 48 }
  },
  {
    id: 'eastern',
    name: 'Eastern Region (R9)',
    description: 'Managing forests across 20 northeastern states.',
    states: ['CT', 'DE', 'IL', 'IN', 'IA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MO', 'NH', 'NJ', 'NY', 'OH', 'PA', 'RI', 'VT', 'WV', 'WI'],
    color: 'bg-yellow-400',
    position: { x: 70, y: 28 }
  },
  {
    id: 'alaska',
    name: 'Alaska Region (R10)',
    description: 'Managing over 22 million acres in Alaska.',
    states: ['AK'],
    color: 'bg-green-900',
    position: { x: 12, y: 85 }
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
              <div className="relative w-full md:w-2/3 h-[400px] map-container rounded-lg border border-green-900 overflow-hidden forest-element">
                <div className="leaf"></div>
                <div className="leaf"></div>
                <div className="leaf"></div>
                
                {/* Detailed US map */}
                <svg
                  viewBox="0 0 950 600"
                  className="w-full h-full opacity-40"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g fill="url(#map-gradient)" stroke="#2F4F40" strokeWidth="1.5">
                    {/* Continental US */}
                    <path d="M243,178 L241,217 L247,242 L261,262 L277,284 L295,297 L348,316 L359,328 L368,350 L369,371 L379,392 L378,407 L395,432 L401,460 L399,473 L393,482 L383,492 L358,492 L344,485 L307,485 L285,478 L273,463 L260,454 L236,443 L225,426 L198,400 L176,373 L156,357 L137,350 L117,339 L114,324 L121,305 L131,293 L137,269 L147,252 L166,241 L180,224 L181,203 L177,194 L175,178 L162,168 L151,147 L142,139 L139,120 L143,105 L130,87 L113,78 L103,59 L112,52 L125,38 L141,35 L157,48 L170,48 L184,65 L199,77 L210,101 L225,110 L241,123 L251,128 L263,135 L268,151 L276,166 L280,178 L286,182 L298,182 L316,192 L330,210 L342,219 L352,225 L375,218 L385,206 L401,196 L417,195 L424,204 L429,221 L452,221 L468,218 L487,227 L491,234 L526,234 L558,246 L576,246 L596,238 L607,223 L618,221 L641,211 L661,200 L693,194 L720,181 L742,179 L765,166 L768,149 L761,123 L766,107 L773,100 L783,78 L794,64 L800,44 L791,22 L774,12 L760,13 L746,24 L738,23 L697,31 L673,27 L662,16 L658,1 L641,4 L628,13 L606,8 L591,13 L576,28 L566,31 L550,25 L527,27 L517,44 L503,59 L489,83 L473,98 L451,121 L436,124 L426,115 L402,114 L390,109 L381,94 L375,80 L364,69 L361,50 L358,41 L346,35 L334,18 L323,6 L307,2 L293,5 L279,17 L263,32 L256,47 L254,64 L246,82 L243,102 L250,127 L243,138 L232,140 L219,147 L211,161 L209,174 L217,184 L222,192 L224,211 L221,224 L213,230 L212,236 L208,237 L208,229 L201,213 L194,202 L187,198 L172,198 L167,208 L168,227 L180,241 L195,249 L199,262 L198,276 L191,294 L176,317 L167,326 L158,326 L151,314 L145,305 L140,292 L136,278 L129,266 L122,262 L115,249 L110,238 L101,227 L93,216 L83,204 L71,197 L65,187 L70,174 L78,161 L83,146 L89,136 L93,121 L100,110 L108,94 L113,87 L107,77 L100,70 L95,54 L90,44 L83,33 L74,30 L66,36 L59,47 L54,58 L46,68 L36,79 L29,89 L23,101 L17,114 L11,128 L4,142 L1,154 L3,167 L13,176 L24,180 L32,182 L38,196 L42,208 L36,219 L27,226 L22,237 L24,247 L21,256 L17,264 L8,269 L3,278 L7,285 L13,290 L21,292 L26,297 L31,307 L35,316 L37,326 L43,331 L50,331 L59,329 L67,328 L75,334 L81,343 L87,352 L94,359 L101,365 L112,369 L121,374 L124,385 L129,395 L136,401 L150,401 L163,398 L178,392 L187,388 L200,391 L213,397 L223,406 L233,414 L244,421 L253,425 L265,422 L278,419 L291,421 L302,424 L315,423 L332,420 L345,411 L347,399 L357,386 L369,382 L384,378 L396,380 L406,388 L417,394 L426,397 L435,395 L447,392 L457,389 L469,389 L483,390 L495,393 L504,396 L520,396 L528,393 L540,387 L550,380 L557,373 L567,366 L575,358 L575,348 L583,342 L594,339 L606,337 L620,335 L634,333 L648,332 L662,331 L674,329 L681,325 L691,318 L700,317 L712,321 L722,322 L739,320 L753,314 L767,308 L781,300 L793,293 L804,286" />
                    
                    {/* Alaska */}
                    <path d="M95,420 L87,429 L75,432 L62,430 L50,423 L44,414 L44,404 L50,395 L61,393 L74,396 L85,404 L92,413 L95,420" />
                    <path d="M32,430 L24,437 L13,438 L5,434 L1,426 L6,419 L16,417 L25,421 L32,430" />
                    <path d="M162,425 L172,420 L183,423 L188,431 L183,440 L172,442 L163,438 L158,430 L162,425" />
                    <path d="M125,428 L114,436 L102,439 L91,435 L88,427 L93,419 L105,416 L116,419 L125,428" />
                    
                    {/* Hawaii */}
                    <path d="M45,520 L34,518 L27,523 L22,529 L21,536 L25,544 L33,545 L42,541 L47,535 L48,527 L45,520" />
                    <path d="M68,515 L75,512 L82,516 L80,523 L73,527 L67,523 L68,515" />
                    <path d="M94,511 L103,514 L111,518 L104,525 L94,527 L87,521 L94,511" />
                    <path d="M120,505 L129,502 L139,505 L136,515 L126,520 L117,516 L120,505" />
                    <path d="M146,495 L159,493 L170,498 L165,510 L153,514 L142,510 L146,495" />
                  </g>
                  <defs>
                    <linearGradient id="map-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a4c29" />
                      <stop offset="100%" stopColor="#0e2817" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Region colored areas that match the forest service map color scheme */}
                <svg
                  viewBox="0 0 950 600"
                  className="w-full h-full absolute top-0 left-0 opacity-10 z-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g stroke="#2F4F40" strokeWidth="0.5">
                    {/* Eastern Region (R9) - Yellow */}
                    <path d="M558,246 L576,246 L596,238 L607,223 L618,221 L641,211 L661,200 L693,194 L720,181 L742,179 L765,166 L768,149 L761,123 L766,107 L773,100 L783,78 L794,64 L800,44 L791,22 L774,12 L760,13 L746,24 L738,23 L697,31 L673,27 L662,16 L658,1 L641,4 L628,13 L606,8 L591,13 L576,28 L566,31 L550,25 L527,27 L517,44 L503,59 L489,83 L473,98 L451,121 L436,124 L426,115 L402,114 L390,109 L381,94 L375,80 L364,69 L361,50 L358,41 L346,35 L334,18 L323,6 L307,2 L293,5 L279,17 L465,55 L487,227 L491,234 L526,234 L558,246" fill="#f7ce46" />
                    
                    {/* Southern Region (R8) - Green */}
                    <path d="M243,178 L241,217 L247,242 L261,262 L277,284 L295,297 L348,316 L359,328 L368,350 L369,371 L379,392 L378,407 L395,432 L401,460 L399,473 L393,482 L383,492 L358,492 L344,485 L307,485 L285,478 L273,463 L260,454 L236,443 L225,426 L198,400 L483,390 L495,393 L504,396 L520,396 L528,393 L540,387 L550,380 L557,373 L567,366 L575,358 L575,348 L583,342 L594,339 L606,337 L620,335 L634,333 L648,332 L662,331 L674,329 L681,325 L691,318 L700,317 L712,321 L722,322 L739,320 L753,314 L767,308 L781,300 L793,293 L804,286 L794,298 L435,395 L447,392 L457,389 L469,389 L243,178" fill="#70A65F" />
                    
                    {/* Northern Region (R1) - Brown */}
                    <path d="M243,102 L250,127 L243,138 L232,140 L219,147 L211,161 L209,174 L217,184 L222,192 L224,211 L221,224 L213,230 L212,236 L208,237 L208,229 L201,213 L194,202 L187,198 L172,198 L167,208 L168,227 L180,241 L244,421 L253,425 L265,422 L278,419 L291,421 L302,424 L315,423 L332,420 L345,411 L347,399 L357,386 L369,382 L384,378 L245,155 L243,102" fill="#b08850" />
                    
                    {/* Rocky Mountain Region (R2) - Cream */}
                    <path d="M199,262 L198,276 L191,294 L176,317 L167,326 L158,326 L151,314 L145,305 L140,292 L136,278 L129,266 L122,262 L115,249 L110,238 L101,227 L93,216 L83,204 L71,197 L65,187 L70,174 L78,161 L83,146 L89,136 L93,121 L100,110 L108,94 L113,87 L107,77 L100,70 L150,401 L163,398 L178,392 L187,388 L200,391 L213,397 L223,406 L233,414 L200,350 L199,262" fill="#f5f1e0" />
                    
                    {/* Pacific Northwest Region (R6) - Light Green */}
                    <path d="M43,331 L50,331 L59,329 L67,328 L75,334 L81,343 L87,352 L94,359 L101,365 L112,369 L121,374 L124,385 L129,395 L136,401 L110,330 L43,331" fill="#d8e4bc" />
                    
                    {/* Intermountain Region (R4) - Light Yellow */}
                    <path d="M95,54 L90,44 L83,33 L74,30 L66,36 L59,47 L54,58 L46,68 L36,79 L29,89 L23,101 L17,114 L11,128 L4,142 L1,154 L3,167 L13,176 L24,180 L32,182 L38,196 L42,208 L36,219 L27,226 L22,237 L24,247 L21,256 L17,264 L8,269 L3,278 L7,285 L13,290 L21,292 L26,297 L31,307 L35,316 L37,326 L100,310 L95,54" fill="#f7f4cc" />
                    
                    {/* Pacific Southwest Region (R5) - Amber/Orange */}
                    <path d="M176,373 L156,357 L137,350 L117,339 L114,324 L121,305 L131,293 L137,269 L147,252 L166,241 L180,224 L181,203 L177,194 L175,178 L162,168 L151,147 L142,139 L139,120 L143,105 L130,87 L113,78 L103,59 L112,52 L125,38 L141,35 L157,48 L170,48 L184,65 L199,77 L176,373" fill="#FFBF00" />
                    
                    {/* Southwestern Region (R3) - Amber Brown */}
                    <path d="M396,380 L406,388 L417,394 L426,397 L400,380 L396,380" fill="#b08850" />
                    
                    {/* Alaska Region (R10) - Forest Green */}
                    <path d="M95,420 L87,429 L75,432 L62,430 L50,423 L44,414 L44,404 L50,395 L61,393 L74,396 L85,404 L92,413 L95,420" fill="#2e5e38" />
                    <path d="M32,430 L24,437 L13,438 L5,434 L1,426 L6,419 L16,417 L25,421 L32,430" fill="#2e5e38" />
                    <path d="M162,425 L172,420 L183,423 L188,431 L183,440 L172,442 L163,438 L158,430 L162,425" fill="#2e5e38" />
                    <path d="M125,428 L114,436 L102,439 L91,435 L88,427 L93,419 L105,416 L116,419 L125,428" fill="#2e5e38" />
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
              <div className="w-full md:w-1/3 h-[400px] overflow-y-auto bg-green-950/50 rounded-lg p-4 border border-green-800">
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
              <p>The U.S. Forest Service is divided into 9 regions (R1-R9) plus Alaska (R10), managing 155 national forests and 20 grasslands.</p>
              <p className="text-green-600/70 flex items-center justify-center">
                <i className="fas fa-info-circle mr-1"></i>
                Click on the region markers (R1-R10) to explore details about each Forest Service region
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForestRegionMap;