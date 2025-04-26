import { useState, FormEvent, ChangeEvent } from "react";

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
  
  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
      <div className="relative flex-grow">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Ask about the US Forest Service..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none"
          disabled={disabled}
          autoComplete="off"
        />
        {inputValue && (
          <button 
            type="button" 
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times-circle"></i>
          </button>
        )}
      </div>
      <button
        type="submit"
        className={`bg-forest-600 text-white rounded-lg px-4 py-2 hover:bg-forest-700 transition-colors flex items-center space-x-1 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled || !inputValue.trim()}
      >
        <span>Send</span>
        <i className="fas fa-paper-plane"></i>
      </button>
    </form>
  );
}
