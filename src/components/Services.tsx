import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { data } from "../data";
import { 
  Laptop, 
  Brain, 
  Radio, 
  Plus, 
  Check, 
  ArrowRight, 
  Calculator, 
  Clock, 
  Coins, 
  Cpu, 
  Layers, 
  Sparkles,
  ShieldCheck
} from "lucide-react";

type ServiceType = "Website Development" | "AI Solutions" | "IoT Systems";
type ProjectTier = "Launchpad (MVP)" | "Velocity (Full Product)" | "Apex (Enterprise)";

interface AddOn {
  id: string;
  name: string;
  price: number;
  desc: string;
  category: ServiceType[];
}

export function Services() {
  const [selectedService, setSelectedService] = useState<ServiceType>("Website Development");
  const [selectedTier, setSelectedTier] = useState<ProjectTier>("Velocity (Full Product)");
  const [activeAddOns, setActiveAddOns] = useState<string[]>([]);
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>("Brutalist / Avant-garde");

  // Define pricing mapping
  const basePrices: Record<ServiceType, Record<ProjectTier, number>> = {
    "Website Development": {
      "Launchpad (MVP)": 1500,
      "Velocity (Full Product)": 3500,
      "Apex (Enterprise)": 6500,
    },
    "AI Solutions": {
      "Launchpad (MVP)": 2000,
      "Velocity (Full Product)": 4500,
      "Apex (Enterprise)": 8000,
    },
    "IoT Systems": {
      "Launchpad (MVP)": 2500,
      "Velocity (Full Product)": 5000,
      "Apex (Enterprise)": 9500,
    }
  };

  const deliveryDays: Record<ServiceType, Record<ProjectTier, number>> = {
    "Website Development": {
      "Launchpad (MVP)": 14,
      "Velocity (Full Product)": 30,
      "Apex (Enterprise)": 60,
    },
    "AI Solutions": {
      "Launchpad (MVP)": 21,
      "Velocity (Full Product)": 45,
      "Apex (Enterprise)": 90,
    },
    "IoT Systems": {
      "Launchpad (MVP)": 30,
      "Velocity (Full Product)": 60,
      "Apex (Enterprise)": 120,
    }
  };

  const allAddOns: AddOn[] = [
    { id: "database", name: "Database & Auth Suite", price: 600, desc: "Robust data store (PostgreSQL/MongoDB) with secure user accounts.", category: ["Website Development", "AI Solutions", "IoT Systems"] },
    { id: "stripe", name: "Stripe Checkout & Billing", price: 500, desc: "Configure secure webhooks, recurring subscriptions, and invoicing.", category: ["Website Development"] },
    { id: "lumen3d", name: "Unreal / Spline 3D Scene", price: 900, desc: "Interactive web-canvas 3D models with high-fidelity illumination.", category: ["Website Development"] },
    { id: "voice", name: "Custom TTS & Voice Cloning", price: 800, desc: "Integration with ElevenLabs or Whisper for localized voice engines.", category: ["AI Solutions"] },
    { id: "vector", name: "RAG & Vector Search Vector DB", price: 750, desc: "Feed custom knowledge bases securely into AI context memories.", category: ["AI Solutions"] },
    { id: "pcb", name: "PCB Schematic & Layout", price: 850, desc: "Custom hardware routing ready for fabrication manufacture.", category: ["IoT Systems"] },
    { id: "dashboard", name: "Real-time Telemetry Control", price: 700, desc: "Responsive visual graph meters powered by MQTT messaging websockets.", category: ["IoT Systems", "AI Solutions"] },
    { id: "priority", name: "Priority Express Turnaround", price: 500, desc: "Guaranteed development cycle fast-tracked in half the time.", category: ["Website Development", "AI Solutions", "IoT Systems"] },
  ];

  // Filter add-ons matching active service
  const serviceAddOns = allAddOns.filter(addon => addon.category.includes(selectedService));

  // Toggle Add-on helper
  const toggleAddOn = (id: string) => {
    setActiveAddOns(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Reset addons when service type changes
  useEffect(() => {
    setActiveAddOns([]);
  }, [selectedService]);

  // Calculate total metrics
  const basePrice = basePrices[selectedService][selectedTier];
  const addedPrice = allAddOns
    .filter(addon => activeAddOns.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = basePrice + addedPrice;

  const baseDays = deliveryDays[selectedService][selectedTier];
  const activeDays = activeAddOns.includes("priority") ? Math.ceil(baseDays * 0.6) : baseDays;

  const complexityRating = () => {
    let score = 2;
    if (selectedTier === "Velocity (Full Product)") score += 3;
    if (selectedTier === "Apex (Enterprise)") score += 6;
    score += activeAddOns.length;
    return Math.min(10, score);
  };

  // Generate brief and trigger scroll/fill
  const handleRequestQuote = () => {
    const addonsText = activeAddOns.length > 0 
      ? allAddOns.filter(a => activeAddOns.includes(a.id)).map(a => a.name).join(", ")
      : "None selected";

    const briefMessage = 
`Hi Meril, I used your portfolio brief configurator to draft a custom request:

- Service Type: ${selectedService}
- Project Tier: ${selectedTier}
- Aesthetic Theme: ${selectedAesthetic}
- Add-ons: ${addonsText}
- Estimated Budget: $${totalPrice.toLocaleString()}
- Expected Timeline: ${activeDays} days

Looking forward to discussing this project soon!`;

    // Dispatch custom event to trigger contact form input
    const event = new CustomEvent("contact-prefill", {
      detail: { message: briefMessage }
    });
    window.dispatchEvent(event);
  };

  const serviceIcon = (title: string) => {
    switch (title) {
      case "Website Development": return <Laptop className="w-5 h-5 text-brand-orange" />;
      case "AI Solutions": return <Brain className="w-5 h-5 text-brand-orange" />;
      case "IoT Systems": return <Radio className="w-5 h-5 text-brand-orange" />;
      default: return <Laptop className="w-5 h-5 text-brand-orange" />;
    }
  };

  return (
    <section id="services" className="bg-brand-black text-brand-white px-6 py-24 md:py-32 relative overflow-hidden border-t border-brand-white/10">
      <div className="noise-bg"></div>
      
      {/* Background Spotlight */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[180px] pointer-events-none z-0"></div>

      <div className="max-w-[1140px] mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4 text-brand-orange text-sm font-mono tracking-widest uppercase">
              <Cpu className="w-5 h-5 animate-spin-slow" />
              <span>Services & Capabilities</span>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl uppercase tracking-tighter italic leading-none text-brand-white">
              Professional <span className="text-brand-orange">Services</span>
            </h2>
          </div>
          <div className="max-w-md text-brand-gray/80 text-sm md:text-base leading-relaxed">
            I build high-performance products tailored to your precise vision. Use the interactive <strong>Custom Brief Configurator</strong> below to blueprint your ideal project parameters in real-time.
          </div>
        </div>

        {/* Services Static Deck & Features Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {data.services.map((service, idx) => (
            <div 
              key={service.title} 
              className="bg-brand-dark/40 border border-brand-white/10 p-8 flex flex-col justify-between group hover:border-brand-orange/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-brand-white/5 border border-brand-white/10 flex items-center justify-center">
                    {serviceIcon(service.title)}
                  </div>
                  <span className="font-mono text-xs text-brand-gray/40 font-bold">0{idx + 1}</span>
                </div>
                
                <h3 className="font-heading text-2xl uppercase tracking-wide text-brand-white mb-4 group-hover:text-brand-orange transition-colors">
                  {service.title}
                </h3>
                
                <ul className="space-y-3">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-xs md:text-sm text-brand-gray/80">
                      <span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-brand-white/5">
                <button 
                  onClick={() => {
                    setSelectedService(service.title as ServiceType);
                    const element = document.getElementById("brief-configurator");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-[10px] font-mono uppercase text-brand-orange tracking-widest font-bold flex items-center gap-2 hover:text-brand-white transition-colors cursor-pointer"
                >
                  <span>Configure Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Calculator Section Divider */}
        <div id="brief-configurator" className="border-t border-brand-white/10 pt-20 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-black px-4 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-orange" />
            <span className="font-mono text-xs uppercase tracking-widest font-black text-brand-orange">Brief Configurator</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
            
            {/* Input Controllers Grid Column */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* Option 1: Choose Service Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-wider uppercase">
                  <span className="w-5 h-5 rounded-full border border-brand-orange/40 flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Select Core Service Domain</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Website Development", "AI Solutions", "IoT Systems"].map((svc) => (
                    <button
                      key={svc}
                      onClick={() => setSelectedService(svc as ServiceType)}
                      className={`p-4 border font-mono text-xs font-bold uppercase tracking-wider text-center transition-all duration-300 relative ${
                        selectedService === svc 
                          ? "bg-brand-white/5 border-brand-orange text-brand-white" 
                          : "border-brand-white/10 hover:border-brand-white/20 text-brand-gray/60"
                      }`}
                    >
                      {selectedService === svc && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange"></div>
                      )}
                      <span>{svc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Choose Project Complexity Tier */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-wider uppercase">
                  <span className="w-5 h-5 rounded-full border border-brand-orange/40 flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Choose Scalability Tier</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "Launchpad (MVP)", label: "Launchpad", desc: "Prototype & MVP" },
                    { id: "Velocity (Full Product)", label: "Velocity", desc: "Scalable Release" },
                    { id: "Apex (Enterprise)", label: "Apex", desc: "Bespoke Enterprise" }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id as ProjectTier)}
                      className={`p-4 border text-left transition-all duration-300 relative ${
                        selectedTier === tier.id 
                          ? "bg-brand-white/5 border-brand-orange text-brand-white" 
                          : "border-brand-white/10 hover:border-brand-white/20 text-brand-gray/60"
                      }`}
                    >
                      <div className="font-mono text-xs font-bold uppercase tracking-wider">{tier.label}</div>
                      <div className="text-[10px] text-brand-gray/40 mt-1">{tier.desc}</div>
                      {selectedTier === tier.id && (
                        <div className="absolute bottom-2 right-2">
                          <Check className="w-4 h-4 text-brand-orange" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Select Aesthetic Direction */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-wider uppercase">
                  <span className="w-5 h-5 rounded-full border border-brand-orange/40 flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Select Aesthetic Direction</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Modern Minimalist", "Brutalist / Avant-garde", "Immersive Dark Mode"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedAesthetic(theme)}
                      className={`p-4 border font-mono text-xs font-bold uppercase tracking-wider text-center transition-all duration-300 relative ${
                        selectedAesthetic === theme 
                          ? "bg-brand-white/5 border-brand-orange text-brand-white" 
                          : "border-brand-white/10 hover:border-brand-white/20 text-brand-gray/60"
                      }`}
                    >
                      <span>{theme}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 4: Enable Add-ons / Integrations */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-wider uppercase">
                  <span className="w-5 h-5 rounded-full border border-brand-orange/40 flex items-center justify-center font-bold text-[10px]">4</span>
                  <span>Integrations & Add-ons</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceAddOns.map((addon) => {
                    const active = activeAddOns.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-5 border text-left transition-all duration-300 flex items-start gap-4 relative group ${
                          active 
                            ? "bg-brand-white/5 border-brand-orange text-brand-white" 
                            : "border-brand-white/10 hover:border-brand-white/20 text-brand-gray/60"
                        }`}
                      >
                        <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          active ? "border-brand-orange bg-brand-orange text-brand-black" : "border-brand-white/20 group-hover:border-brand-orange"
                        }`}>
                          {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="font-bold text-xs uppercase tracking-wide">{addon.name}</span>
                            <span className="font-mono text-xs text-brand-orange font-bold">+${addon.price}</span>
                          </div>
                          <p className="text-[10px] text-brand-gray/40 mt-1 leading-relaxed">
                            {addon.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Price Preview & Generated Brief Deck */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-brand-dark border border-brand-white/10 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="space-y-8">
                  
                  {/* Brief Header */}
                  <div className="border-b border-brand-white/10 pb-6">
                    <h3 className="font-heading text-2xl uppercase tracking-wider text-brand-white">
                      Bespoke <span className="text-brand-orange">Blueprint</span>
                    </h3>
                    <p className="text-[11px] font-mono text-brand-gray/60 uppercase tracking-widest mt-1">Real-time configuration review</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-mono text-[10px] text-brand-gray uppercase tracking-widest">Estimated Budget:</span>
                      <span className="font-heading text-5xl text-brand-orange font-bold leading-none">${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-brand-gray/40 uppercase pt-2">
                      <span>Base Budget: ${basePrice.toLocaleString()}</span>
                      <span>Add-ons: ${addedPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Metric Readouts */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-brand-white/10 py-6">
                    {/* Delivery timeline */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-brand-gray text-[10px] font-mono uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Timeline</span>
                      </div>
                      <div className="text-xl font-heading uppercase text-brand-white">
                        ~{activeDays} Days
                      </div>
                      <div className="text-[9px] font-mono text-brand-gray/40 uppercase">
                        {activeAddOns.includes("priority") ? "Fast-tracked Cycle" : "Standard Cycle"}
                      </div>
                    </div>

                    {/* Complexity index */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-brand-gray text-[10px] font-mono uppercase tracking-wider">
                        <Layers className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Complexity</span>
                      </div>
                      <div className="text-xl font-heading uppercase text-brand-white flex items-center gap-2">
                        {complexityRating()}/10
                      </div>
                      <div className="w-full bg-brand-white/5 h-1 border border-brand-white/10">
                        <div 
                          className="bg-brand-orange h-full transition-all duration-500"
                          style={{ width: `${complexityRating() * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Summary of Blueprint Parameters */}
                  <div className="space-y-3.5">
                    <h4 className="font-mono text-[10px] text-brand-orange font-bold uppercase tracking-widest">Configuration Summary:</h4>
                    
                    <div className="space-y-2 text-xs font-mono text-brand-gray/80">
                      <div className="flex justify-between">
                        <span className="text-brand-gray/40">SERVICE DOMAIN:</span>
                        <span className="text-brand-white font-bold">{selectedService}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-gray/40">SCALABILITY TIER:</span>
                        <span className="text-brand-white font-bold">{selectedTier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-gray/40">VISUAL THEME:</span>
                        <span className="text-brand-white font-bold">{selectedAesthetic}</span>
                      </div>
                      <div className="flex flex-col gap-1 pt-1.5">
                        <span className="text-brand-gray/40">INTEGRATION SUITES:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activeAddOns.length > 0 ? (
                            allAddOns
                              .filter(a => activeAddOns.includes(a.id))
                              .map(a => (
                                <span key={a.id} className="text-[9px] font-mono bg-brand-white/5 border border-brand-white/10 px-2 py-0.5 text-brand-gray">
                                  {a.name.split(" ")[0]}
                                </span>
                              ))
                          ) : (
                            <span className="text-brand-gray/30 italic text-[10px]">None selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Request Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRequestQuote}
                    className="w-full bg-brand-orange text-brand-black hover:bg-brand-white py-4 font-bold uppercase tracking-widest transition-colors duration-300 text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Generate Custom Brief</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <div className="flex items-center gap-2 justify-center text-[10px] font-mono text-brand-gray/40 uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Transfers automatically to Contact Form</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
