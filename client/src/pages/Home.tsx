import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import DebugPanel from "@/components/DebugPanel";
import Footer from "@/components/Footer";
import { DebugInformation } from "@/lib/types";
import { toggleDebugMode } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";

export default function Home() {
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInformation | null>(null);
  const { toast } = useToast();
  
  const handleToggleDebug = async () => {
    try {
      const newDebugMode = !debugMode;
      await toggleDebugMode(newDebugMode);
      setDebugMode(newDebugMode);
      
      if (newDebugMode) {
        toast({
          title: "Debug Mode Enabled",
          description: "You can now see detailed information about the chat process."
        });
      }
    } catch (error) {
      console.error("Error toggling debug mode:", error);
      toast({
        title: "Error",
        description: "Failed to toggle debug mode.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateDebugInfo = (info: DebugInformation) => {
    setDebugInfo(info);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 font-sans text-gray-100">
      <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleDebug}
          className={`text-white ${debugMode ? 'bg-forest-600' : 'hover:bg-forest-700'}`}
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-2 flex flex-col md:flex-row gap-6">
        <ChatInterface 
          debugMode={debugMode}
          onUpdateDebugInfo={handleUpdateDebugInfo}
        />
        
        {debugMode && (
          <DebugPanel 
            visible={debugMode} 
            debugInfo={debugInfo} 
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
