export default function LoadingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="bot-avatar">
        <i className="fas fa-tree"></i>
      </div>
      <div className="bot-message flex items-center relative">
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
