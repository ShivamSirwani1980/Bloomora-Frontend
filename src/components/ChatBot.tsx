import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Paperclip, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { json } from 'react-router-dom';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    fileName?: string;
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! I'm Bloomora's AI assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() && !selectedFile) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
            fileName: selectedFile?.name,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        const formData = new FormData();
        if (inputValue.trim()) {
            formData.append('text', inputValue);
        }
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        // Capture the file for clearing it after we store the data in FormData
        const fileToUpload = selectedFile;
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1/main/Bloomora/'}/api/v1/main/Bloomora/ChatAI/`, {
    method: 'POST',
    body: formData,
});

const data = await response.json();

let responseText = "";

if (typeof data.reply === "string") {
    responseText = data.reply;
} 
else if (typeof data.reply === "object") {
    responseText = data.reply.error || data.reply.message || "Server error";
} 
else {
    responseText = "Unexpected response from server";
}

const botResponse: Message = {
    id: (Date.now() + 1).toString(),
    text: responseText,
    sender: 'bot',
    timestamp: new Date(),
};

setMessages((prev) => [...prev, botResponse]);
}catch (error) {
            console.error("Chat API error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I couldn't reach the server right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 right-6 w-[350px] shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col bg-background border border-border"
                        style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Bloomora Assistant</h3>
                                    <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-primary-foreground/20 p-2 rounded-full transition-colors"
                                aria-label="Close Chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>

                                        <div className={`px-4 py-2 rounded-2xl ${msg.sender === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                            : 'bg-muted rounded-tl-sm'
                                            }`}>
                                            {msg.fileName && (
                                                <div className={`flex items-center gap-2 text-xs mb-1 ${msg.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'} bg-black/10 p-2 rounded-md`}>
                                                    <Paperclip className="w-3 h-3" />
                                                    <span className="truncate max-w-[150px]">{msg.fileName}</span>
                                                </div>
                                            )}
                                            {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                                            <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 max-w-[85%]">
                                        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Typing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-background border-t border-border">
                            {selectedFile && (
                                <div className="flex items-center justify-between bg-muted/50 py-2 px-3 rounded-lg mb-2 border border-border/50">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Paperclip className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-xs text-muted-foreground truncate">{selectedFile.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedFile(null)}
                                        className="text-muted-foreground hover:text-foreground ml-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                <div className="flex-1 bg-muted rounded-xl border border-transparent focus-within:border-primary/50 focus-within:bg-background transition-colors flex items-center">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 text-muted-foreground hover:text-primary transition-colors"
                                        aria-label="Attach File"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent py-3 pr-3 outline-none text-sm min-w-0"
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="rounded-xl h-[46px] w-[46px] shrink-0"
                                    disabled={(!inputValue.trim() && !selectedFile) || isLoading}
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-50 hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chat"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>
        </>
    );
}
