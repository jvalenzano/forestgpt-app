export default function LoadingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-forest-700 text-white rounded-full p-2 flex-shrink-0">
        <i className="fas fa-tree"></i>
      </div>
      <div className="bg-gray-100 rounded-lg p-3 max-w-[85%] flex items-center">
        <span className="typing-dots flex space-x-1">
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-100"></span>
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
        </span>
        <span className="ml-2 text-sm text-gray-500">Searching fs.usda.gov...</span>
      </div>
    </div>
  );
}
