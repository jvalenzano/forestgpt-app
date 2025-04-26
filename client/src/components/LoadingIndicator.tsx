export default function LoadingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-forest-600 text-white rounded-full p-2 w-9 h-9 flex items-center justify-center shadow-sm flex-shrink-0">
        <i className="fas fa-tree"></i>
      </div>
      <div className="bg-white border border-forest-100 rounded-2xl p-4 max-w-[85%] shadow-sm flex items-center">
        <div className="text-sm font-semibold text-forest-800 mr-2">ForestGPT</div>
        <span className="typing-dots flex space-x-1.5">
          <span className="h-2.5 w-2.5 bg-forest-400 rounded-full animate-pulse"></span>
          <span className="h-2.5 w-2.5 bg-forest-500 rounded-full animate-pulse delay-100"></span>
          <span className="h-2.5 w-2.5 bg-forest-600 rounded-full animate-pulse delay-200"></span>
        </span>
        <span className="ml-3 text-sm text-gray-500 italic">
          <i className="fas fa-search text-forest-400 mr-1"></i>
          Searching Forest Service resources...
        </span>
      </div>
    </div>
  );
}
