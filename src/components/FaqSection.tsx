"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Coffee } from "lucide-react";
import { Badge } from "./ui/Badge";
import ScrollReveal from "./ScrollReveal";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: "General & Location",
    question: "Where is Cosmos Gaming located and what are your opening hours?",
    answer:
      "Cosmos Gaming Centre is located at Office No. 23, New Shopping Centre, Government Colony, Bandra East, Mumbai - 400051 (conveniently accessible from BKC). We are open 7 days a week, Monday through Sunday, from 11:00 AM to 11:00 PM.",
  },
  {
    category: "Cafe & Social Lounge",
    question: "Is food and coffee available during gaming sessions?",
    answer:
      "Yes. Inspired by venues like OS NYC, we give equal weight to hospitality. Our lounge features an artisan coffee bar serving 100% Arabica espresso, vanilla cold brew, and matcha, alongside fresh smash burgers, truffle parmesan fries, and craft bites delivered directly to your gaming desk.",
  },
  {
    category: "Virtual Reality (VR)",
    question: "What makes the VR Tactical Gun setup unique?",
    answer:
      "Our VR Arena features full 360-degree room-scale tracking paired with specialized physical VR recoil gun peripherals. You can play intense zombie survival campaigns, tactical military shooters, horror scenarios, Beat Saber, and virtual cricket with dedicated coach assistance.",
  },
  {
    category: "Booking & Walk-ins",
    question: "Do I need to book slots online or can I walk in directly?",
    answer:
      "Walk-ins are always welcome based on station availability. During peak evening and weekend hours, reserving your station in advance through our online booking system guarantees your desired PS5, PC, VR, or Racing Sim station.",
  },
  {
    category: "Hardware Specifications",
    question: "What hardware do your PC and PS5 zones feature?",
    answer:
      "Our tournament PC battleground runs Intel Core i9 processors, NVIDIA GeForce RTX 4080-4090 GPUs, 240Hz 0.5ms Fast-IPS displays, hot-swap mechanical keyboards, and 8000Hz mice over gigabit fiber LAN. The PS5 lounge offers Sony PlayStation 5 consoles on 4K 120Hz screens with DualSense controllers.",
  },
  {
    category: "Promotions & Passes",
    question: "How do I claim the 'Buy 1 Hour, Get 1 Hour FREE' offer?",
    answer:
      "You can apply promo code COSMOSBOGO during online slot booking for any 2-hour session, or mention the code at the front reception desk upon arrival before your session starts.",
  },
  {
    category: "Squads & Private Events",
    question: "Can I host birthday parties, LAN tournaments, or corporate gaming sessions?",
    answer:
      "Yes. We offer customized group packages and private zone reservations for birthdays, squad tournaments, and corporate hangouts. Reach out directly via phone or WhatsApp at +91 97694 64603 for customized group pricing.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-zinc-800 bg-[#121212]">
      {/* Section Header */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="accent" size="sm" className="font-['Space_Grotesk',sans-serif] font-bold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            Clear Answers
          </Badge>

          <h2 className="font-['Space_Grotesk',sans-serif] text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            FREQUENTLY ASKED <br />
            <span className="text-zinc-400">QUESTIONS</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            Everything you need to know about our Bandra East esports lounge, cafe menu, hardware, and booking policies.
          </p>
        </div>
      </ScrollReveal>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <ScrollReveal key={index} delayMs={index * 30}>
              <div
                className="rounded-xl border border-zinc-800 hover:border-zinc-700 bg-[#18181b]/95 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#ea580c] uppercase tracking-widest font-['Space_Grotesk',sans-serif] font-bold">
                      {faq.category}
                    </span>
                    <h3 className="font-['Space_Grotesk',sans-serif] text-base sm:text-lg font-bold text-white tracking-wide">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-lg bg-[#121212] border border-zinc-800 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-zinc-800 text-white border-zinc-700" : "text-zinc-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
