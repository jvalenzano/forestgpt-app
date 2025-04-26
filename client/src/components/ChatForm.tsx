import { useState, FormEvent, ChangeEvent, KeyboardEvent } from "react";

interface ChatFormProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatForm({ onSendMessage, disabled = false }: ChatFormProps) {
  const [inputValue, setInputValue] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleClear = () => {
    setInputValue("");
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !disabled) {
        onSendMessage(inputValue);
        setInputValue("");
      }
    }
  };
  
  const handleSendClick = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the US Forest Service..."
          className="w-full bg-white border-2 border-forest-200 rounded-full px-6 py-3 pr-16 shadow-sm hover:shadow focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all"
          disabled={disabled}
          autoComplete="off"
        />
        
        {/* Clear button */}
        {inputValue && (
          <button 
            type="button" 
            onClick={handleClear}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-times-circle"></i>
          </button>
        )}
        
        {/* Send button inside input */}
        <button
          type="button"
          onClick={handleSendClick}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-forest-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-forest-700 transition-colors ${
            disabled || !inputValue.trim() ? "opacity-50 cursor-not-allowed" : "shadow-md hover:shadow-lg"
          }`}
          disabled={disabled || !inputValue.trim()}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      
      {/* Accessibility improvement: hidden submit button to support form submission */}
      <button type="submit" className="sr-only">Send</button>
    </form>
  );
}
