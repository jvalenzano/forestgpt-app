interface HeaderProps {
  debugMode: boolean;
  onToggleDebug: () => void;
}

export default function Header({ debugMode, onToggleDebug }: HeaderProps) {
  return (
    <header className="bg-forest-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-tree text-2xl text-forest-100"></i>
          <h1 className="text-xl font-bold">ForestGPT</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleDebug}
            className={`text-sm px-3 py-1 rounded ${debugMode ? 'bg-forest-600' : 'bg-forest-700 hover:bg-forest-600'} transition-colors`}
          >
            <i className="fas fa-bug mr-1"></i> Debug
          </button>
          <a 
            href="https://www.fs.usda.gov/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm px-3 py-1 rounded hover:bg-forest-700 transition-colors"
          >
            <i className="fas fa-external-link-alt mr-1"></i> USFS Website
          </a>
        </div>
      </div>
    </header>
  );
}
