"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTrip } from "@/lib/trip-context";
import { addDaysToDate } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { 
  Send, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Bed, 
  Plane,
  Lightbulb,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  actions?: { label: string; action: string }[];
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hey! I'm your travel guide. I can help you plan your journey, find hostels, adjust your itinerary, or answer questions about your destinations. What would you like to do?",
    suggestions: [
      "Extend my stay in Medellin",
      "Find hostels with co-working spaces",
      "Add a stop in Guanajuato",
      "What's the best time to visit Antigua?"
    ]
  }
];

const mockResponses: Record<string, Message> = {
  "extend": {
    id: "",
    role: "assistant",
    content: "I can extend your stay in Medellin. You're currently planned for 7 nights (May 19-26). The weather is perfect that time of year, and there's great nightlife on weekends. How many extra nights would you like to add?",
    actions: [
      { label: "+3 nights", action: "extend_3" },
      { label: "+5 nights", action: "extend_5" },
      { label: "+7 nights", action: "extend_7" },
    ]
  },
  "coworking": {
    id: "",
    role: "assistant",
    content: "I found several hostels with great co-working spaces along your route:\n\n**Selina Medellin** - Fast WiFi, standing desks, 24/7 access\n**Viajero Cartagena** - Rooftop workspace, AC, good coffee\n**Casa Elemento** (Santa Marta) - Mountain views, hammock office!\n\nWant me to add any of these to your itinerary?",
    suggestions: [
      "Book Selina Medellin",
      "Tell me more about Casa Elemento",
      "Show all co-working hostels"
    ]
  },
  "add": {
    id: "",
    role: "assistant",
    content: "Guanajuato is amazing! Colorful colonial streets, great food scene, and the famous Callejon del Beso. I can add it between Mexico City and Oaxaca - it's about 4 hours by bus. How many nights would you like to stay?",
    actions: [
      { label: "2 nights", action: "add_2" },
      { label: "3 nights", action: "add_3" },
      { label: "4 nights", action: "add_4" },
    ]
  },
  "antigua": {
    id: "",
    role: "assistant",
    content: "Great question! **Antigua** is best visited during the dry season (November to April). You're arriving March 19th which is perfect timing!\n\n**Pro tips:**\n- Semana Santa (Easter week) has incredible processions but gets very crowded\n- Volcano hikes are clearer in the morning\n- Take Spanish classes at one of the many schools\n\nWant me to book a hostel or find volcano tours?",
    suggestions: [
      "Book a hostel in Antigua",
      "Find volcano hiking tours",
      "What about Spanish schools?"
    ]
  },
  "default": {
    id: "",
    role: "assistant",
    content: "I understand you want to make changes to your trip. Let me help you with that! You can ask me things like:\n\n- \"Add a stop in [city]\"\n- \"Extend my stay in [destination]\"\n- \"Find hostels with [amenity]\"\n- \"Book transport from [A] to [B]\"\n\nWhat would you like to do?",
    suggestions: [
      "Show my full itinerary",
      "What's not booked yet?",
      "Recommend a beach destination"
    ]
  }
};

function getResponse(input: string): Message {
  const lower = input.toLowerCase();
  if (lower.includes("extend") || lower.includes("stay longer")) {
    return { ...mockResponses["extend"], id: Date.now().toString() };
  }
  if (lower.includes("cowork") || lower.includes("co-work") || lower.includes("wifi") || lower.includes("digital nomad")) {
    return { ...mockResponses["coworking"], id: Date.now().toString() };
  }
  if (lower.includes("add") || lower.includes("guanajuato")) {
    return { ...mockResponses["add"], id: Date.now().toString() };
  }
  if (lower.includes("antigua") || lower.includes("best time")) {
    return { ...mockResponses["antigua"], id: Date.now().toString() };
  }
  return { ...mockResponses["default"], id: Date.now().toString() };
}

export function ChatGuide() {
  const {
    trip,
    setSubPage,
    setSelectedStop,
    setSelectedLeg,
    updateStopDates,
    setActiveTab,
  } = useTrip();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findStopByCity = useCallback(
    (city: string) => trip.stops.find((s) => s.city.toLowerCase() === city.toLowerCase()),
    [trip.stops]
  );

  const findLegByRoute = useCallback(
    (fromCity: string, toCity: string) =>
      trip.transitLegs.find((leg) => {
        const from = trip.stops.find((s) => s.id === leg.fromStopId);
        const to = trip.stops.find((s) => s.id === leg.toStopId);
        return from?.city.toLowerCase() === fromCity.toLowerCase() && to?.city.toLowerCase() === toCity.toLowerCase();
      }),
    [trip.transitLegs, trip.stops]
  );

  const handleActionClick = useCallback(
    async (action: { label: string; action: string }) => {
      const userMsg: Message = { id: Date.now().toString(), role: "user", content: action.label };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      let reply = "";
      const actionId = action.action;

      if (actionId.startsWith("extend_")) {
        const nights = parseInt(actionId.replace("extend_", ""), 10) || 3;
        const stop = findStopByCity("Medellin");
        if (stop) {
          const newEnd = addDaysToDate(stop.endDate, nights);
          updateStopDates(stop.id, stop.startDate, newEnd);
          reply = `Done! I've extended your stay in Medellin by ${nights} nights. Your itinerary and all downstream dates have been updated.`;
        } else {
          reply = `I couldn't find Medellin on your trip. Try selecting a stop on your journey to extend.`;
        }
      } else if (actionId.startsWith("add_")) {
        const nights = actionId.replace("add_", "");
        reply = `Guanajuato for ${nights} nights is a great choice! For now you can add it manually from your itinerary. Full "add stop" is coming soon.`;
      } else {
        reply = "Done! Let me know if you need anything else.";
      }

      await new Promise((r) => setTimeout(r, 600));
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: reply };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    },
    [findStopByCity, updateStopDates]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      const lower = suggestion.toLowerCase();
      if (lower.includes("book selina") || lower.includes("book a hostel in medellin")) {
        const stop = findStopByCity("Medellin");
        if (stop) {
          setSelectedStop(stop);
          setSubPage("hostelDetails");
        }
      } else if (lower.includes("book a hostel in antigua")) {
        const stop = findStopByCity("Antigua");
        if (stop) {
          setSelectedStop(stop);
          setSubPage("hostelDetails");
        }
      } else if (lower.includes("what's not booked") || lower.includes("unbooked")) {
        setActiveTab("journey");
        setSubPage("bookings");
      } else if (lower.includes("show my full itinerary") || lower.includes("full itinerary")) {
        setActiveTab("journey");
        setSubPage("timeline");
      } else if (lower.includes("modify") || lower.includes("change my booking")) {
        const booked = trip.stops.find((s) => s.bookingStatus === "booked") || trip.stops[0];
        if (booked) {
          setSelectedStop(booked);
          setSubPage("bookingDetails");
        }
      }
      handleSend(suggestion);
    },
    [findStopByCity, setSelectedStop, setSubPage, setActiveTab, trip.stops]
  );

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const response = getResponse(messageText);
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">The Guide</h2>
            <p className="text-xs text-muted-foreground">AI-powered trip assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 pb-32">
        {messages.map((message) => (
          <div key={message.id} className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start"
          )}>
            <div className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3",
              message.role === "user" 
                ? "bg-primary text-primary-foreground rounded-br-md" 
                : "bg-muted text-foreground rounded-bl-md"
            )}>
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              
              {/* Action Buttons - perform trip actions when action id is present */}
              {message.actions && message.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.actions.map((action, i) => (
                    <Button 
                      key={i} 
                      size="sm" 
                      variant="secondary"
                      className="text-xs"
                      onClick={() => (action.action ? handleActionClick(action) : handleSend(action.label))}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="shrink-0 px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <Badge 
            variant="outline" 
            className="shrink-0 cursor-pointer hover:bg-primary/10 hover:border-primary"
            onClick={() => handleSuggestionClick("What's not booked yet?")}
          >
            <Bed className="w-3 h-3 mr-1" />
            Unbooked stays
          </Badge>
          <Badge 
            variant="outline" 
            className="shrink-0 cursor-pointer hover:bg-primary/10 hover:border-primary"
            onClick={() => handleSuggestionClick("Add a new destination")}
          >
            <MapPin className="w-3 h-3 mr-1" />
            Add destination
          </Badge>
          <Badge 
            variant="outline" 
            className="shrink-0 cursor-pointer hover:bg-primary/10 hover:border-primary"
            onClick={() => handleSuggestionClick("Reschedule my trip")}
          >
            <Calendar className="w-3 h-3 mr-1" />
            Adjust dates
          </Badge>
          <Badge 
            variant="outline" 
            className="shrink-0 cursor-pointer hover:bg-primary/10 hover:border-primary"
            onClick={() => handleSuggestionClick("Find the cheapest flight")}
          >
            <Plane className="w-3 h-3 mr-1" />
            Find flights
          </Badge>
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 pb-6 border-t border-border bg-card">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your trip..."
            className="flex-1 bg-muted rounded-full px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="shrink-0 w-11 h-11 rounded-full gradient-primary"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}
