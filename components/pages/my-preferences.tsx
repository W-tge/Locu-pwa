"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  DollarSign,
  Bed,
  Globe,
} from "lucide-react";

export function MyPreferences() {
  const { userPreferences, setUserPreferences, setSubPage } = useTrip();
  const [localPrefs, setLocalPrefs] = useState(userPreferences);
  const [saved, setSaved] = useState(false);

  const accommodationOptions = [
    { id: "hostels", label: "Hostels" },
    { id: "budget-hotels", label: "Budget Hotels" },
    { id: "shared-rooms", label: "Shared Rooms" },
    { id: "private-rooms", label: "Private Rooms" },
  ];

  const handleAccommodationChange = (id: string, checked: boolean) => {
    setLocalPrefs(prev => ({
      ...prev,
      accommodationTypes: checked
        ? [...prev.accommodationTypes, id]
        : prev.accommodationTypes.filter(t => t !== id),
    }));
  };

  const handleSave = () => {
    setUserPreferences(localPrefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getSliderLabel = (value: number, type: "security" | "sustainability" | "sociability") => {
    if (value < 33) return type === "sociability" ? "Solo Focus" : "Low";
    if (value < 66) return "Medium";
    return type === "sociability" ? "Social Butterfly" : "High";
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => setSubPage(null)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-sm border border-primary rounded px-1.5">LOCU</span>
          <h1 className="text-xl font-bold">My Preferences</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Budget Preferences */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 text-primary mb-4">
            <DollarSign className="w-5 h-5" />
            <h2 className="font-bold text-foreground">Budget Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Daily Budget</label>
              <Select
                value={localPrefs.dailyBudget}
                onValueChange={(v) => setLocalPrefs(prev => ({ ...prev, dailyBudget: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$0-30 per day">$0-30 per day</SelectItem>
                  <SelectItem value="$30-50 per day">$30-50 per day</SelectItem>
                  <SelectItem value="$50-75 per day">$50-75 per day</SelectItem>
                  <SelectItem value="$75-100 per day">$75-100 per day</SelectItem>
                  <SelectItem value="$100+ per day">$100+ per day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Currency</label>
              <Select
                value={localPrefs.currency}
                onValueChange={(v) => setLocalPrefs(prev => ({ ...prev, currency: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD ($)">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="AUD ($)">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Accommodation Preferences */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Bed className="w-5 h-5" />
            <h2 className="font-bold text-foreground">Accommodation Preferences</h2>
          </div>
          
          <div className="space-y-3">
            {accommodationOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-3">
                <Checkbox
                  id={option.id}
                  checked={localPrefs.accommodationTypes.includes(option.id) || 
                    localPrefs.accommodationTypes.includes(option.label)}
                  onCheckedChange={(checked) => handleAccommodationChange(option.label, !!checked)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor={option.id} className="text-sm text-foreground cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Globe className="w-5 h-5" />
            <h2 className="font-bold text-foreground">Travel Preferences</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Security Priority</span>
                <span className="text-sm text-muted-foreground">
                  {getSliderLabel(localPrefs.securityPriority, "security")}
                </span>
              </div>
              <Slider
                value={[localPrefs.securityPriority]}
                onValueChange={(v) => setLocalPrefs(prev => ({ ...prev, securityPriority: v[0] }))}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Sustainability Focus</span>
                <span className="text-sm text-muted-foreground">
                  {getSliderLabel(localPrefs.sustainabilityFocus, "sustainability")}
                </span>
              </div>
              <Slider
                value={[localPrefs.sustainabilityFocus]}
                onValueChange={(v) => setLocalPrefs(prev => ({ ...prev, sustainabilityFocus: v[0] }))}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Sociability Level</span>
                <span className="text-sm text-muted-foreground">
                  {getSliderLabel(localPrefs.sociabilityLevel, "sociability")}
                </span>
              </div>
              <Slider
                value={[localPrefs.sociabilityLevel]}
                onValueChange={(v) => setLocalPrefs(prev => ({ ...prev, sociabilityLevel: v[0] }))}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Solo Focus</span>
                <span>Social Butterfly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="p-4 bg-card border-t border-border">
        <Button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12"
        >
          {saved ? "Saved!" : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
