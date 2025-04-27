import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const AssistantSidebar = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef(null);

    // Автоскролл к последнему сообщению
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputText,
            isUser: true,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            console.log('Sending request to /api/chat with question:', userMessage.text);
            const response = await axiosInstance.post('/api/chat', {
                question: userMessage.text,
            });

            console.log('Received response:', response.data);
            const assistantMessage = {
                id: messages.length + 2,
                text: response.data.response,
                isUser: false,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Ошибка при отправке сообщения ассистенту:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось получить ответ от ассистента.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div
            className={cn(
                'fixed top-0 left-0 h-full w-[400px] bg-white shadow-lg z-[100] transform transition-transform duration-300',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            <div className="flex flex-col h-full">
                {/* Заголовок и кнопка закрытия */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <Bot className="w-6 h-6 text-gray-600" />
                        <h2 className="text-lg font-semibold">Ассистент</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Область сообщений */}
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center">Задайте свой вопрос ассистенту!</p>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    'mb-4 p-3 rounded-lg',
                                    message.isUser ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
                                )}
                            >
                                <p className="text-sm">{message.text}</p>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="mb-4 p-3 rounded-lg bg-gray-100 mr-8">
                            <p className="text-sm text-gray-500">Ассистент думает...</p>
                        </div>
                    )}
                </ScrollArea>

                {/* Поле ввода и кнопка отправки */}
                <div className="p-4 border-t">
                    <div className="flex space-x-2">
                        <Input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Введите ваш вопрос..."
                            disabled={isLoading}
                        />
                        <Button onClick={handleSendMessage} disabled={isLoading || !inputText.trim()}>
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssistantSidebar;