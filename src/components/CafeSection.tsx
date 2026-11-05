"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "./ui/Badge";
import { Coffee, UtensilsCrossed, Sparkles, Check, Flame } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface MenuItem {
  id: string;
  name: string;
  category: "coffee" | "kitchen";
  description: string;
  price: number;
  badge?: string;
  diet: "veg" | "non-veg" | "all";
}

const MENU_ITEMS: MenuItem[] = [
  // Coffee & Drinks
  {
    id: "c-1",
    name: "Nitro Vanilla Cold Brew",
    category: "coffee",
    description: "Slow-steeped for 18 hours, infused with Madagascar vanilla bean syrup and served over crystal ice.",
    price: 160,
    badge: "Staff Pick",
    diet: "veg",
  },
  {
    id: "c-2",
    name: "Double Shot Espresso",
    category: "coffee",
    description: "Single-origin Arabica beans, dense hazelnut crema, intense chocolate and caramel notes.",
    price: 120,
    badge: "Classic",
    diet: "veg",
  },
  {
    id: "c-3",
    name: "Kyoto Iced Matcha Latte",
    category: "coffee",
    description: "Ceremonial Uji matcha whisked with creamy oat milk and lightly sweetened with organic agave.",
    price: 190,
    diet: "veg",
  },
  {
    id: "c-4",
    name: "Mango Passion Nitro Red Bull Float",
    category: "coffee",
    description: "Cold Red Bull Energy drink stirred with natural Alphonso mango puree and citrus spritz.",
    price: 210,
    badge: "Gamer Fuel",
    diet: "veg",
  },
  {
    id: "c-5",
    name: "Belgian Dark Cocoa Shake",
    category: "coffee",
    description: "Rich dark cocoa ganache blended with creamy vanilla ice cream and roasted hazelnut crumbs.",
    price: 220,
    diet: "veg",
  },
  // Kitchen & Gourmet Food
  {
    id: "f-1",
    name: "The Cosmos Smashed Burger",
    category: "kitchen",
    description: "Double crispy smashed chicken/beef patty, melted cheddar, house secret relish, toasted brioche bun.",
    price: 260,
    badge: "Bestseller",
    diet: "non-veg",
  },
  {
    id: "f-2",
    name: "Truffle Parmesan Herb Fries",
    category: "kitchen",
    description: "Golden crispy hand-cut potatoes tossed in Italian white truffle oil, rosemary, and aged parmesan.",
    price: 180,
    badge: "Must Try",
    diet: "veg",
  },
  {
    id: "f-3",
    name: "Korean Sweet-Chili Glazed Bites",
    category: "kitchen",
    description: "Tender crispy chicken or cottage cheese cubes glazed in sticky gochujang chili, garlic, and sesame.",
    price: 220,
    diet: "non-veg",
  },
  {
    id: "f-4",
    name: "Artisanal 3-Cheese Sourdough Melt",
    category: "kitchen",
    description: "Smoked mozzarella, sharp cheddar, and provolone toasted golden on artisan seeded sourdough.",
    price: 190,
    diet: "veg",
  },
  {
    id: "f-5",
    name: "Smoked Peri-Peri Loaded Nachos",
    category: "kitchen",
    description: "Crispy stone-ground corn chips, warm jalapeño cheese emulsion, pico de gallo, and sour cream.",
    price: 190,
    diet: "veg",
  },
];

export default function CafeSection() {
  const [activeCategory, setActiveCategory] = useState<"all" | "coffee" | "kitchen">("all");

  const filteredItems = activeCategory === "all"
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="cafe" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800 bg-[#121212]">
      <ScrollReveal>
        {/* Section Header (OS NYC Reference) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="accent" size="sm" className="font-['Space_Grotesk',sans-serif] font-bold tracking-wider uppercase">
              <Coffee className="w-3.5 h-3.5 mr-1" />
              OS NYC Inspired Hospitality
            </Badge>

            <h2 className="font-['Space_Grotesk',sans-serif] text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              LOUNGE CAFE <br />
              <span className="text-zinc-400">&amp; SOCIAL KITCHEN</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
              We give equal weight to hospitality and high-end hardware. Enjoy specialty coffee,
              craft coolers, and gourmet comfort food served directly to your desk or enjoyed
              in our relaxed social seating area.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 bg-[#18181b] border border-zinc-800 p-1.5 rounded-lg shrink-0">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                activeCategory === "all"
                  ? "bg-[#ea580c] text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveCategory("coffee")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                activeCategory === "coffee"
                  ? "bg-[#ea580c] text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Coffee &amp; Drinks
            </button>
            <button
              onClick={() => setActiveCategory("kitchen")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                activeCategory === "kitchen"
                  ? "bg-[#ea580c] text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Kitchen &amp; Bites
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Visual Photography Triple Strip (Food/Coffee next to Keyboards) */}
      <ScrollReveal delayMs={100}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {/* Photo 1: Coffee & Keyboard */}
          <div className="group relative h-64 sm:h-72 rounded-lg overflow-hidden border border-zinc-800 bg-[#18181b]">
            <Image
              src="/images/desk-latte.jpg"
              alt="Artisan latte and craft coffee served next to ergonomic gaming keyboards"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white block">
                Artisan Coffee at the Keyboard
              </span>
              <span className="text-[11px] text-zinc-400">
                100% Arabica espresso pulled fresh for marathon sessions.
              </span>
            </div>
          </div>

          {/* Photo 2: Gourmet Burger */}
          <div className="group relative h-64 sm:h-72 rounded-lg overflow-hidden border border-zinc-800 bg-[#18181b]">
            <Image
              src="/images/cafe-burger.jpg"
              alt="Crispy double smashed brioche burger with cheddar from Cosmos Gaming cafe kitchen"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white block">
                Gourmet Smashed Burgers
              </span>
              <span className="text-[11px] text-zinc-400">
                Made to order with toasted brioche and caramelized onions.
              </span>
            </div>
          </div>

          {/* Photo 3: Truffle Fries */}
          <div className="group relative h-64 sm:h-72 rounded-lg overflow-hidden border border-zinc-800 bg-[#18181b]">
            <Image
              src="/images/cafe-fries.jpg"
              alt="Golden truffle parmesan loaded fries served fresh"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white block">
                Loaded Truffle Fries
              </span>
              <span className="text-[11px] text-zinc-400">
                Crispy hand-cut fries with white truffle oil and rosemary.
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item, index) => (
          <ScrollReveal key={item.id} delayMs={index * 40}>
            <div className="bg-[#18181b]/95 border border-zinc-800 hover:border-zinc-700 p-5 rounded-lg flex items-start justify-between gap-4 transition-all">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-['Space_Grotesk',sans-serif] text-base font-bold text-white tracking-wide">
                    {item.name}
                  </h3>
                  {item.badge && (
                    <Badge variant="accent" size="sm" className="text-[10px] py-0 px-1.5 font-bold">
                      {item.badge}
                    </Badge>
                  )}
                  {item.diet === "veg" ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Vegetarian" />
                  ) : item.diet === "non-veg" ? (
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Non-Vegetarian" />
                  ) : null}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-white">
                  ₹{item.price}
                </span>
                <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                  Order at desk
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Service Policy Note */}
      <div className="mt-10 p-4 rounded-lg bg-[#18181b]/60 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Food and beverages are served desk-side without interrupting gameplay or co-op matches.</span>
        </div>
        <span className="text-zinc-500 text-[11px]">Vegetarian and non-vegetarian options prepared separately.</span>
      </div>
    </section>
  );
}

