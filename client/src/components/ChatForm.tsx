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
      <div className="relative w-full flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the US Forest Service..."
            className="chat-input"
            disabled={disabled}
            autoComplete="off"
          />
          
          {/* Clear button */}
          {inputValue && (
            <button 
              type="button" 
              onClick={handleClear}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
              aria-label="Clear input"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>
        
        {/* Send button (outside input now for better visibility) */}
        <button
          type="button"
          onClick={handleSendClick}
          className={`ml-2 bg-gradient-to-br from-forest-600 to-forest-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all ${
            disabled || !inputValue.trim() 
            ? "opacity-50 cursor-not-allowed" 
            : "shadow-md hover:shadow-lg hover:bg-forest-700 hover:scale-105"
          }`}
          disabled={disabled || !inputValue.trim()}
          aria-label="Send message"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      
      {/* Accessibility improvement: hidden submit button to support form submission */}
      <button type="submit" className="sr-only">Send</button>
    </form>
  );
}
