"use client";

import { useState, useMemo } from "react";
import { Heart, Leaf, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import HalaItemModal from "./HalaItemModal";
import type { Choice, ItemWithChoice } from "@/types";


interface Props {
  initialItems: ItemWithChoice[];
  categories: string[];
}

export default function HalaGiftList({ initialItems, categories }: Props) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [healthyOnly, setHealthyOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithChoice | null>(null);

  const allCategories = ["All", ...categories];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchHealthy = !healthyOnly || item.healthy;
      return matchSearch && matchCat && matchHealthy;
    });
  }, [items, search, selectedCategory, healthyOnly]);

function handleChoiceUpdate(itemId: string, choices: Choice[]) {
  setItems((prev) =>
    prev.map((item) =>
      item.id === itemId
        ? {
            ...item,
            choices,
            choice: choices.find((c) => c.variant_id === null) ?? null,
          }
        : item
    )
  );
  if (selectedItem?.id === itemId) {
    setSelectedItem((prev) =>
      prev
        ? {
            ...prev,
            choices,
            choice: choices.find((c) => c.variant_id === null) ?? null,
          }
        : null
    );
  }
}

  const approvedCount = items.filter((i) => i.choice?.hala_approved).length;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 20% 0%, rgba(253,164,175,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(250,204,21,0.10) 0%, transparent 50%), #fefdf8",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(253,205,211,0.5)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link
            href="/hala"
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-600 transition-colors text-sm"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex-1 text-center">
            <h1
              className="font-display text-2xl sm:text-3xl"
              style={{
                fontFamily: "var(--font-cormorant)",
                background: "linear-gradient(135deg, #be123c, #f43f5e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}
            >
              Hala&apos;s Choices
            </h1>
          </div>

          {/* Approved counter */}
          <div className="flex items-center gap-1.5 text-sm">
            <Heart size={14} className="text-rose-500" fill="currentColor" strokeWidth={0} />
            <span className="text-rose-600 font-medium" style={{ fontFamily: "var(--font-jost)" }}>
              {approvedCount}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search bar */}
        <div className="relative mb-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" size={16} />
          <input
            type="text"
            placeholder="Search your wishes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm outline-none"
            style={{
              fontFamily: "var(--font-jost)",
              background: "rgba(255,255,255,0.9)",
              border: "1.5px solid rgba(253,164,175,0.35)",
              color: "#9f1239",
            }}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Category chips */}
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                fontFamily: "var(--font-jost)",
                background:
                  selectedCategory === cat
                    ? "linear-gradient(135deg, #f43f5e, #be123c)"
                    : "rgba(255,255,255,0.9)",
                color: selectedCategory === cat ? "white" : "#be123c",
                border:
                  selectedCategory === cat
                    ? "none"
                    : "1.5px solid rgba(253,164,175,0.45)",
                boxShadow:
                  selectedCategory === cat
                    ? "0 3px 12px rgba(244,63,94,0.3)"
                    : "none",
              }}
            >
              {cat}
            </button>
          ))}

          {/* Healthy toggle */}
          <button
            onClick={() => setHealthyOnly((v) => !v)}
            className="px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ml-auto"
            style={{
              fontFamily: "var(--font-jost)",
              background: healthyOnly
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : "rgba(255,255,255,0.9)",
              color: healthyOnly ? "white" : "#16a34a",
              border: healthyOnly ? "none" : "1.5px solid rgba(34,197,94,0.4)",
              boxShadow: healthyOnly ? "0 3px 12px rgba(34,197,94,0.25)" : "none",
            }}
          >
            <Leaf size={12} />
            Healthy
          </button>
        </div>

        {/* Items grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="mx-auto mb-4 text-rose-200" size={48} fill="currentColor" strokeWidth={0} />
            <p className="text-rose-400 font-display text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>
              Nothing matches yet…
            </p>
            <p className="text-rose-300 text-sm mt-2" style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}>
              Try a different filter, habibi
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, i) => (
              <GiftCard
                key={item.id}
                item={item}
                index={i}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <HalaItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onChoiceUpdate={handleChoiceUpdate}
        />
      )}
    </div>
  );
}

function GiftCard({
  item,
  index,
  onClick,
}: {
  item: ItemWithChoice;
  index: number;
  onClick: () => void;
}) {
  const approved = item.choice?.hala_approved;
  const disapproved = item.choice?.hala_approved === false && item.choice !== null && item.choice !== undefined;

  return (
    <button
      onClick={onClick}
      className="text-left group animate-fade-in"
      style={{ animationDelay: `${0.05 * index}s`, opacity: 0 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "white",
          border: approved
            ? "2px solid #f43f5e"
            : disapproved
            ? "2px solid rgba(0,0,0,0.07)"
            : "1.5px solid rgba(253,205,211,0.5)",
          boxShadow: approved
            ? "0 6px 24px rgba(244,63,94,0.20)"
            : "0 3px 16px rgba(251,113,133,0.08)",
          opacity: disapproved ? 0.6 : 1,
        }}
      >
        {/* Image area */}
        <div className="relative w-full aspect-square overflow-hidden bg-rose-50">
          {item.image_urls && item.image_urls.length > 0 ? (
            <Image
              src={item.image_urls[0]}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Heart size={32} className="text-rose-200" fill="currentColor" strokeWidth={0} />
            </div>
          )}

          {/* Approved / disapproved overlay badge */}
          {item.choice && (
            <div
              className="absolute top-2 right-2 rounded-full text-xs px-2 py-0.5 font-medium"
              style={{
                fontFamily: "var(--font-jost)",
                background: approved ? "rgba(244,63,94,0.9)" : "rgba(0,0,0,0.45)",
                color: "white",
                backdropFilter: "blur(4px)",
              }}
            >
              {approved ? "❤️ Want" : "✗ Nope"}
            </div>
          )}

          {/* Healthy badge */}
          {item.healthy && (
            <div
              className="absolute top-2 left-2 rounded-full text-xs px-2 py-0.5 font-medium flex items-center gap-1"
              style={{
                fontFamily: "var(--font-jost)",
                background: "rgba(34,197,94,0.85)",
                color: "white",
                backdropFilter: "blur(4px)",
              }}
            >
              <Leaf size={9} /> Healthy
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p
            className="font-medium text-sm text-rose-900 leading-snug line-clamp-2 mb-1"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            {item.name}
          </p>
          <span
            className="text-xs text-rose-400/80"
            style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
          >
            {item.category}
          </span>
        </div>
      </div>
    </button>
  );
}
