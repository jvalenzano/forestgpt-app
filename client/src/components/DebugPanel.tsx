import { DebugInformation } from "@/lib/types";

interface DebugPanelProps {
  visible: boolean;
  debugInfo: DebugInformation | null;
}

export default function DebugPanel({ visible, debugInfo }: DebugPanelProps) {
  if (!visible || !debugInfo) {
    return null;
  }
  
  const { 
    queryClassification, 
    scrapedUrls, 
    contentProcessing, 
    llmDetails, 
    rawContentPreview 
  } = debugInfo;

  return (
    <aside className="md:w-1/4 md:block bg-white rounded-lg shadow-md p-4 overflow-y-auto h-[calc(100vh-8rem)]">
      <h2 className="text-lg font-semibold text-forest-900 border-b pb-2 mb-3 flex items-center">
        <i className="fas fa-bug mr-2"></i> Debug Panel
      </h2>
      
      {/* Query Classification */}
      <div className="mb-4">
        <h3 className="font-medium text-sm text-forest-800 mb-1">Query Classification</h3>
        <div className="bg-gray-100 p-2 rounded text-sm">
          <div className="mb-1">
            <span className="font-medium">Category:</span>{" "}
            <span className="text-forest-600">{queryClassification.category}</span>
          </div>
          <div>
            <span className="font-medium">Confidence:</span>{" "}
            <span className="text-forest-600">{queryClassification.confidence.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Scraped URLs */}
      <div className="mb-4">
        <h3 className="font-medium text-sm text-forest-800 mb-1">Scraped URLs</h3>
        <div className="bg-gray-100 p-2 rounded text-xs space-y-1 max-h-32 overflow-y-auto">
          {scrapedUrls.map((url, index) => (
            <div key={index} className="flex items-center">
              {url.status === "success" ? (
                <i className="fas fa-check-circle text-green-500 mr-1"></i>
              ) : (
                <i className="fas fa-times-circle text-red-500 mr-1"></i>
              )}
              <a 
                href={url.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${url.status === "success" ? "text-forest-600" : "text-gray-500"} hover:underline truncate`}
              >
                {url.url}
              </a>
              {url.status === "error" && url.statusCode && (
                <span className="ml-1 text-red-500">({url.statusCode})</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Content Processing */}
      <div className="mb-4">
        <h3 className="font-medium text-sm text-forest-800 mb-1">Content Processing</h3>
        <div className="bg-gray-100 p-2 rounded text-xs">
          <div className="mb-1">
            <span className="font-medium">Raw Content Size:</span>{" "}
            <span>{contentProcessing.rawContentSize.toFixed(1)} KB</span>
          </div>
          <div className="mb-1">
            <span className="font-medium">Processed Size:</span>{" "}
            <span>{contentProcessing.processedSize.toFixed(1)} KB</span>
          </div>
          <div>
            <span className="font-medium">Chunks:</span>{" "}
            <span>{contentProcessing.chunks}</span>
          </div>
        </div>
      </div>
      
      {/* LLM Details */}
      <div className="mb-4">
        <h3 className="font-medium text-sm text-forest-800 mb-1">LLM Details</h3>
        <div className="bg-gray-100 p-2 rounded text-xs">
          <div className="mb-1">
            <span className="font-medium">Model:</span>{" "}
            <span>{llmDetails.model}</span>
          </div>
          <div className="mb-1">
            <span className="font-medium">Tokens:</span>{" "}
            <span>Input: {llmDetails.tokens.input} / Output: {llmDetails.tokens.output}</span>
          </div>
          <div>
            <span className="font-medium">Processing Time:</span>{" "}
            <span>{llmDetails.processingTime.toFixed(1)}s</span>
          </div>
        </div>
      </div>
      
      {/* Raw Content Preview */}
      <div>
        <h3 className="font-medium text-sm text-forest-800 mb-1">Raw Content Preview</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
          {rawContentPreview}
        </pre>
      </div>
    </aside>
  );
}
