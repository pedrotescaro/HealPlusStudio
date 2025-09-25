"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Bot, User, Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export function AdvancedChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: 'user', text: input };
    
    // Placeholder bot response
    const botResponse: Message = { 
      sender: 'bot', 
      text: "Esta é uma resposta simulada. Em uma versão futura, eu usaria um modelo de IA para responder à sua pergunta sobre: '" + input + "'"
    };
    
    setMessages([...messages, userMessage, botResponse]);
    setInput("");
  };

  return (
    <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-2xl h-[70vh] flex flex-col">
            <CardHeader className="text-center">
                <div className="inline-block bg-primary/10 p-3 rounded-full mx-auto">
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Chat com IA (Demonstração)</CardTitle>
                <CardDescription>
                    Faça perguntas sobre o sistema ou peça ajuda para analisar um caso.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                {message.sender === 'bot' && (
                                    <Avatar>
                                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                 {message.sender === 'user' && (
                                    <Avatar>
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <div className="w-full flex items-center gap-2">
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Digite sua mensagem..."
                    />
                    <Button onClick={handleSend} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}
