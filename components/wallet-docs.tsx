"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Wallet, 
  FileText, 
  CreditCard, 
  Plane,
  Bus,
  Building2,
  Plus,
  ChevronRight,
  Shield,
  Download,
  QrCode,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  type: "visa" | "ticket" | "booking" | "insurance";
  title: string;
  subtitle: string;
  expiryDate?: string;
  isOfflineAvailable: boolean;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    type: "visa",
    title: "Mexico Tourist Visa",
    subtitle: "180 days from entry",
    expiryDate: "Aug 28, 2026",
    isOfflineAvailable: true
  },
  {
    id: "2",
    type: "ticket",
    title: "ADO Bus - MEX to OAX",
    subtitle: "Mar 6, 2026 - 08:00",
    isOfflineAvailable: true
  },
  {
    id: "3",
    type: "booking",
    title: "Casa Pepe Hostel",
    subtitle: "Mexico City - Mar 1-5",
    isOfflineAvailable: true
  },
  {
    id: "4",
    type: "insurance",
    title: "World Nomads Policy",
    subtitle: "Policy #WN-2026-48291",
    expiryDate: "Jun 1, 2026",
    isOfflineAvailable: true
  },
  {
    id: "5",
    type: "booking",
    title: "Hostal Central Oaxaca",
    subtitle: "Oaxaca - Mar 6-10",
    isOfflineAvailable: true
  },
];

const budgetSummary = {
  totalBudget: 4500,
  spent: 1250,
  upcoming: 850,
  currency: "USD"
};

function getDocIcon(type: string) {
  switch (type) {
    case "visa": return FileText;
    case "ticket": return Bus;
    case "booking": return Building2;
    case "insurance": return Shield;
    default: return FileText;
  }
}

function getDocColor(type: string) {
  switch (type) {
    case "visa": return "bg-[#FC2869]/10 text-[#FC2869]";
    case "ticket": return "bg-[#FF9F43]/10 text-[#FF9F43]";
    case "booking": return "bg-[#4ECDC4]/10 text-[#4ECDC4]";
    case "insurance": return "bg-purple-500/10 text-purple-500";
    default: return "bg-muted text-muted-foreground";
  }
}

export function WalletDocs() {
  const [activeTab, setActiveTab] = useState<"docs" | "budget">("docs");

  const remaining = budgetSummary.totalBudget - budgetSummary.spent - budgetSummary.upcoming;
  const spentPercent = (budgetSummary.spent / budgetSummary.totalBudget) * 100;
  const upcomingPercent = (budgetSummary.upcoming / budgetSummary.totalBudget) * 100;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground text-lg">Wallet & Docs</h2>
            <p className="text-xs text-muted-foreground">Your travel documents, offline ready</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab("docs")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "docs" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "budget" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}
          >
            Budget
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 pb-24">
        {activeTab === "docs" ? (
          <>
            {/* Offline Ready Banner */}
            <div className="rounded-xl border border-[#4ECDC4]/30 bg-[#4ECDC4]/5 p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-[#4ECDC4]" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">All docs available offline</p>
                <p className="text-xs text-muted-foreground">Last synced 2 hours ago</p>
              </div>
            </div>
            
            {/* Documents List */}
            <div className="space-y-2">
              {mockDocuments.map((doc) => {
                const Icon = getDocIcon(doc.type);
                return (
                  <button 
                    key={doc.id}
                    className="w-full rounded-xl border border-border bg-card p-3 flex items-center gap-3 hover:border-primary/50 transition-colors text-left"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", getDocColor(doc.type))}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.subtitle}</p>
                      {doc.expiryDate && (
                        <p className="text-[10px] text-[#FF9F43] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Expires: {doc.expiryDate}
                        </p>
                      )}
                    </div>
                    {doc.isOfflineAvailable && (
                      <Badge variant="outline" className="text-[10px] border-[#4ECDC4] text-[#4ECDC4] shrink-0">
                        Offline
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                );
              })}
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                <QrCode className="w-5 h-5" />
                <span className="text-xs">Show QR Codes</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Payment Cards</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Budget Overview */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Trip Budget</h3>
                <span className="text-sm text-muted-foreground">{budgetSummary.currency}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#4ECDC4] h-full transition-all" 
                  style={{ width: `${spentPercent}%` }}
                />
                <div 
                  className="bg-[#FF9F43] h-full transition-all" 
                  style={{ width: `${upcomingPercent}%` }}
                />
              </div>
              
              {/* Legend */}
              <div className="flex justify-between mt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Spent</p>
                  <p className="font-bold text-[#4ECDC4]">${budgetSummary.spent.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Upcoming</p>
                  <p className="font-bold text-[#FF9F43]">${budgetSummary.upcoming.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="font-bold text-foreground">${remaining.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {/* Daily Budget */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Daily Budget</p>
                  <p className="text-2xl font-bold text-foreground">$50</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Today's Spend</p>
                  <p className="text-2xl font-bold text-[#4ECDC4]">$32</p>
                </div>
              </div>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-[#4ECDC4] h-full rounded-full" style={{ width: "64%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">$18 left for today</p>
            </div>
            
            {/* Recent Expenses */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Expenses</h3>
              <div className="space-y-2">
                {[
                  { name: "Casa Pepe Hostel", amount: 72, category: "Accommodation" },
                  { name: "ADO Bus Ticket", amount: 35, category: "Transport" },
                  { name: "Tacos La Güera", amount: 8, category: "Food" },
                  { name: "Museum Entry", amount: 5, category: "Activities" },
                ].map((expense, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                    <div>
                      <p className="font-medium text-foreground text-sm">{expense.name}</p>
                      <p className="text-xs text-muted-foreground">{expense.category}</p>
                    </div>
                    <p className="font-bold text-foreground">${expense.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
