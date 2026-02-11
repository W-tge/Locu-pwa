"use client";

import React from "react"

import { useTrip } from "@/lib/trip-context";
import {
  ArrowLeft,
  Phone,
  AlertTriangle,
  CreditCard,
  Heart,
  Clipboard,
  Sun,
  Lock,
  Shield,
  Bus,
} from "lucide-react";

interface SafetyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SafetyCard({ icon, title, description }: SafetyCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <span className="text-primary">{icon}</span>
      </div>
      <h3 className="font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function SafetyToolkit() {
  const { setSubPage } = useTrip();

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
        <h1 className="text-xl font-bold">Safety Toolkit</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Current Location Emergency Info - First for quick access */}
        <section className="bg-[#FFFEF9] paper-texture rounded-2xl border-2 border-primary/30 p-4 paper-shadow">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full gradient-vibrant flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-foreground">Cusco, Peru</h3>
              <p className="micro-label">Local Emergency Numbers</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-[#DDD8CC]">
              <span className="text-muted-foreground font-medium">Police</span>
              <span className="font-mono font-bold text-foreground">105</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-[#DDD8CC]">
              <span className="text-muted-foreground font-medium">Ambulance</span>
              <span className="font-mono font-bold text-foreground">117</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-[#DDD8CC]">
              <span className="text-muted-foreground font-medium">Fire</span>
              <span className="font-mono font-bold text-foreground">116</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-dashed border-[#DDD8CC]">
              <span className="text-muted-foreground font-medium">Tourist Police</span>
              <span className="font-mono font-bold text-foreground">(084) 235-123</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-muted-foreground font-medium">Nearest Hospital</span>
              <span className="font-mono font-bold text-foreground text-right">Hospital Regional Cusco<br /><span className="text-xs text-muted-foreground font-normal">0.8km away</span></span>
            </div>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SafetyCard
              icon={<Phone className="w-5 h-5" />}
              title="Local Emergency Numbers"
              description="Always know the local emergency service numbers for police, ambulance, and fire departments. Save them in your phone."
            />
            <SafetyCard
              icon={<AlertTriangle className="w-5 h-5" />}
              title="Embassy/Consulate Details"
              description="Keep contact information for your country's embassy or consulate handy for assistance abroad."
            />
            <SafetyCard
              icon={<CreditCard className="w-5 h-5" />}
              title="Financial Institution Contacts"
              description="Note down numbers for your bank and credit card companies to report lost or stolen cards immediately."
            />
          </div>
        </section>

        {/* Health & Wellness */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Health & Wellness</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SafetyCard
              icon={<Heart className="w-5 h-5" />}
              title="Medical Kit Essentials"
              description="Carry a basic first-aid kit with bandages, antiseptic wipes, pain relievers, and any personal medications."
            />
            <SafetyCard
              icon={<Clipboard className="w-5 h-5" />}
              title="Vaccination Requirements"
              description="Check and fulfill all necessary vaccination requirements for your destination well in advance of travel."
            />
            <SafetyCard
              icon={<Sun className="w-5 h-5" />}
              title="Climate Preparedness"
              description="Understand the local climate and pack appropriate clothing and gear to handle weather changes."
            />
          </div>
        </section>

        {/* Personal Security */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Personal Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SafetyCard
              icon={<Lock className="w-5 h-5" />}
              title="Secure Your Valuables"
              description="Use hotel safes, secure your backpack, and avoid displaying expensive items in public."
            />
            <SafetyCard
              icon={<Shield className="w-5 h-5" />}
              title="Awareness of Surroundings"
              description="Stay alert and aware of your environment, especially in crowded areas or unfamiliar neighborhoods."
            />
            <SafetyCard
              icon={<Bus className="w-5 h-5" />}
              title="Safe Transportation"
              description="Use reputable transportation services and avoid unlicensed taxis or rideshares."
            />
          </div>
        </section>


      </div>
    </div>
  );
}
