import { useState, useMemo } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useProfileStore } from "@/store/useProfileStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Star, CheckCircle, Users, BarChart2, Zap, Plus, X } from "lucide-react";
import { toast } from "sonner";

// ─── Static mock data for UI mockups ────────────────────────────────────────

const MOCK_CREATORS = [
  {
    id: "1",
    name: "MrBeast",
    handle: "@mrbeast",
    platform: "YouTube",
    followers: "240M",
    engagement: "8.4%",
    avatar: "https://yt3.googleusercontent.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s480-c-k-c0x00ffffff-no-rj",
    verified: true,
    category: "Entertainment",
    brandSafety: 98,
  },
  {
    id: "2",
    name: "Khaby Lame",
    handle: "@khaby.lame",
    platform: "TikTok",
    followers: "162M",
    engagement: "6.1%",
    avatar: "https://imgp.sptds.icu/v2?9gRRkBbg4nctjMDXek72QZVfwaM%2B9JyelB0J2IwjGfU5qrdIuBTqbpa5S%2B1WOkIwHAVH03R0TVmK0Oy0yObCmwuIsrGx60XSYd%2BD6nKKd8aNGm6dJgPNj02cA0jIQu3V%2Bk78B76Sl4D1WCFaQ7oUVfcU3Sucu%2BziMExlEdMhxTs%3D",
    verified: true,
    category: "Comedy",
    brandSafety: 95,
  },
  {
    id: "3",
    name: "Cristiano Ronaldo",
    handle: "@cristiano",
    platform: "Instagram",
    followers: "617M",
    engagement: "2.1%",
    avatar: "https://imgp.sptds.icu/v2?mb0KwpL92uYofJiSjDn1%2F6peL1lBwv3s%2BUvShHERlDaDVMq5CUHy%2BkcsdYgF20nDsuUwkRjFVav5M3TrTU9h7%2BxcZBxCJ2RhABotd8JjaVVGHFCcdShtZRKywU%2BQReCwgNlJUwVYqIiahjW32e%2BqWA%3D%3D",
    verified: true,
    category: "Sports",
    brandSafety: 97,
  },
];

const TRENDING = ["MrBeast", "Khaby Lame", "Cristiano Ronaldo", "Ali Abdaal", "Marques Brownlee"];
const TAGS = ["#Beauty", "#Gaming", "#Fitness", "#Food", "#Travel", "#Tech", "#Fashion"];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "YouTube") return <span className="text-[13px]">▶️</span>;
  if (platform === "TikTok") return <span className="text-[13px]">🎵</span>;
  return <span className="text-[13px]">📷</span>;
}

function MockCreatorCard({ creator, index }: { creator: typeof MOCK_CREATORS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="bg-white rounded-2xl p-5 border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.07)] flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={creator.avatar} alt={creator.name} className="w-11 h-11 rounded-full object-cover" />
            {creator.verified && (
              <CheckCircle size={14} className="absolute -bottom-0.5 -right-0.5 text-blue-500 fill-white" />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-black leading-tight">{creator.name}</div>
            <div className="text-xs text-gray-400 font-medium">{creator.handle}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-black/5">
          <PlatformIcon platform={creator.platform} />
          {creator.platform}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#FAF8F4] rounded-xl p-2.5 text-center">
          <div className="text-[11px] font-bold text-gray-400 mb-0.5 flex items-center justify-center gap-1"><Users size={10} /> Followers</div>
          <div className="font-black text-sm text-black">{creator.followers}</div>
        </div>
        <div className="bg-[#FAF8F4] rounded-xl p-2.5 text-center">
          <div className="text-[11px] font-bold text-gray-400 mb-0.5 flex items-center justify-center gap-1"><BarChart2 size={10} /> Eng.</div>
          <div className="font-black text-sm text-black">{creator.engagement}</div>
        </div>
        <div className="bg-[#FAF8F4] rounded-xl p-2.5 text-center">
          <div className="text-[11px] font-bold text-gray-400 mb-0.5 flex items-center justify-center gap-1"><Zap size={10} /> Safety</div>
          <div className="font-black text-sm text-green-600">{creator.brandSafety}%</div>
        </div>
      </div>
      <button 
        onClick={() => toast.info("This is a demo! Use the actual search above.", { duration: 3000 })}
        className="w-full flex items-center justify-center gap-2 text-[12px] font-bold py-2 rounded-xl border-2 border-black/10 hover:border-black hover:bg-black hover:text-white transition-all"
      >
        <Plus size={14} /> Add to List
      </button>
    </motion.div>
  );
}

function HeroDashboardMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12">
      {/* Background depth blobs */}
      <div className="absolute -top-12 left-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-8 right-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

      {/* Browser chrome frame */}
      <div className="relative bg-[#1a1a2e] rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.2)] overflow-hidden">
        {/* Window bar */}
        <div className="flex items-center gap-2 px-5 py-4 bg-[#111122] border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <div className="ml-4 flex-1 bg-white/5 rounded-lg px-4 py-1.5 text-xs text-white/30 font-mono">
            wobb.ai/search
          </div>
        </div>

        {/* App content */}
        <div className="bg-[#FAF8F4] p-6">
          {/* Fake search bar inside mockup */}
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 mb-6 border border-black/5 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm font-medium flex-1">lifestyle creator, 1M+ followers...</span>
            <span className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg">Search</span>
          </div>

          {/* Fake filter chips */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["All", "Instagram", "YouTube", "TikTok", "Verified"].map((f, i) => (
              <span key={f} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${i === 0 ? "bg-black text-white border-black" : "bg-white text-gray-600 border-black/10"}`}>
                {f}
              </span>
            ))}
            <span className="text-xs text-gray-400 font-medium self-center ml-auto">Showing 1,240 creators</span>
          </div>

          {/* Creator cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_CREATORS.map((c, i) => <MockCreatorCard key={c.id} creator={c} index={i} />)}
          </div>
        </div>
      </div>

      {/* Floating accent badge — top left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute -left-8 top-28 bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-black/5 flex items-center gap-3 z-10"
      >
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
          <TrendingUp size={20} className="text-green-500" />
        </div>
        <div>
          <div className="text-xs font-bold text-gray-500">Avg Engagement</div>
          <div className="text-lg font-black text-black">6.8%</div>
        </div>
      </motion.div>

      {/* Floating accent badge — bottom right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -right-6 bottom-16 bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-black/5 z-10"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <CheckCircle size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold text-black">Added to List</span>
        </div>
        <div className="flex -space-x-2">
          {MOCK_CREATORS.map((c) => (
            <img 
              key={c.id} 
              src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`} 
              onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`; }}
              className="w-7 h-7 rounded-full border-2 border-white object-cover bg-white" 
            />
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-white bg-black text-white text-[10px] flex items-center justify-center font-bold relative z-10">+5</div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Campaign List UI Mockup (Feature 2) ────────────────────────────────────

function CampaignListMockup() {
  const selected = useProfileStore((s) => s.selectedProfiles);
  const displayCreators = selected.length > 0 ? selected.slice(0, 3) : MOCK_CREATORS.map(c => ({
    user_id: c.id,
    username: c.handle.replace("@", ""),
    fullname: c.name,
    picture: c.avatar,
    followers: 0,
    engagement_rate: 0.065,
    is_verified: true,
    url: "",
  }));

  return (
    <div className="bg-[#1a1a2e] rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.2)] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 bg-[#111122] border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <div className="ml-4 text-xs text-white/30 font-mono">Summer Campaign · 3 creators</div>
      </div>
      <div className="bg-[#FAF8F4] p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-black text-black text-lg">Summer Campaign 2026</h3>
          <span className="text-xs font-bold text-white bg-black px-3 py-1.5 rounded-full">Launch →</span>
        </div>
        {displayCreators.map((c: UserProfileSummary, i: number) => {
          const handle = c.username || c.handle || c.user_id;
          const rate = c.engagement_rate ? (c.engagement_rate * 100).toFixed(1) + "%" : "5.3%";
          return (
            <motion.div
              key={c.user_id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 bg-white rounded-xl p-4 border border-black/5 shadow-sm"
            >
              <img 
                src={c.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(handle)}&background=random`} 
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(handle)}&background=random`; }}
                alt={c.fullname} 
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-black truncate">{c.fullname || handle}</div>
                <div className="text-xs text-gray-400">@{handle}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-gray-500">Engagement</div>
                <div className="font-black text-sm text-green-600">{rate}</div>
              </div>
              <CheckCircle size={18} className="text-blue-500 shrink-0" />
            </motion.div>
          );
        })}
        <div className="flex gap-3 pt-2">
          <div className="flex-1 bg-white rounded-xl p-3 border border-black/5 text-center">
            <div className="text-xs font-bold text-gray-400">Total Reach</div>
            <div className="font-black text-black">419M+</div>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 border border-black/5 text-center">
            <div className="text-xs font-bold text-gray-400">Avg Eng.</div>
            <div className="font-black text-green-600">6.6%</div>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 border border-black/5 text-center">
            <div className="text-xs font-bold text-gray-400">Brand Safety</div>
            <div className="font-black text-black">97%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Creator Comparison Cards (Feature 3) ───────────────────────────────────

function CreatorComparisonCard({ creator }: { creator: typeof MOCK_CREATORS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="bg-gradient-to-br from-[#FAF8F4] to-white p-8 text-center border-b border-black/5">
        <div className="relative inline-block mb-4">
          <img 
            src={creator.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=random`} 
            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=random`; }}
            alt={creator.name} 
            className="w-20 h-20 rounded-full object-cover mx-auto" 
          />
          {creator.verified && (
            <CheckCircle size={20} className="absolute bottom-0 right-0 text-blue-500 fill-white" />
          )}
        </div>
        <h3 className="font-black text-xl text-black">{creator.name}</h3>
        <p className="text-gray-400 text-sm font-medium">{creator.handle}</p>
        <span className="inline-flex items-center gap-1.5 mt-3 bg-black/5 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
          <PlatformIcon platform={creator.platform} />
          {creator.platform}
        </span>
      </div>
      <div className="p-6 space-y-3">
        {[
          { label: "Followers", value: creator.followers, icon: <Users size={13} /> },
          { label: "Engagement Rate", value: creator.engagement, icon: <BarChart2 size={13} /> },
          { label: "Brand Safety Score", value: `${creator.brandSafety}/100`, icon: <Star size={13} className="text-yellow-500" /> },
          { label: "Category", value: creator.category, icon: <Zap size={13} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">{icon}{label}</span>
            <span className="font-black text-sm text-black">{value}</span>
          </div>
        ))}
        <button 
          onClick={() => toast.info("This is a demo preview! Search above to build your campaign.", { duration: 3000 })}
          className="w-full mt-2 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add to Campaign
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allProfiles = useMemo(() => {
    if (platform === null) {
      return [
        ...extractProfiles("instagram"),
        ...extractProfiles("youtube"),
        ...extractProfiles("tiktok"),
      ];
    }
    return extractProfiles(platform);
  }, [platform]);

  const filtered = useMemo(() => filterProfiles(allProfiles, searchQuery), [allProfiles, searchQuery]);

  // Show results when a platform is explicitly selected OR user typed a query
  const isShowingResults = platform !== null || searchQuery.trim().length > 0;

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  };

  const handleReset = () => {
    setPlatform(null);
    setSearchQuery("");
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
  };

  return (
    <Layout>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center pt-16 pb-4 px-4">


        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-black max-w-4xl leading-[1.05] mb-5"
        >
          Find creators that actually{" "}
          <span className="italic font-black">move the needle.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-500 font-medium mb-10 max-w-xl"
        >
          Search millions of verified influencers across Instagram, TikTok and YouTube — and build your campaign list in seconds.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-2xl mx-auto flex shadow-[0_4px_24px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden border-2 border-black"
        >
          <div className="flex items-center gap-3 flex-1 bg-white px-5">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              id="main-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or name..."
              className="flex-1 py-4 text-lg focus:outline-none bg-transparent font-medium"
              aria-label="Search influencers"
            />
          </div>
          <button
            className="bg-black text-white px-8 py-4 font-bold text-base hover:bg-gray-900 transition-colors shrink-0"
            aria-label="Submit search"
          >
            Search
          </button>
        </motion.div>

        {/* Platform Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mt-6">
            <PlatformFilter
              selected={platform}
              onChange={handlePlatformChange}
            />
          </div>
        </motion.div>

        {/* Trending + Tags — only when not searching */}
        <AnimatePresence>
          {!isShowingResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex flex-col items-center gap-3"
            >
              <div className="flex flex-wrap justify-center gap-2 items-center">
                <span className="text-xs font-black text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                  <TrendingUp size={12} /> Trending
                </span>
                {TRENDING.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTrendingClick(t)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-black/10 text-gray-700 hover:border-black hover:bg-black hover:text-white transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTrendingClick(tag.replace("#", ""))}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-black/5 text-gray-500 hover:bg-black/10 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CONTENT: Search results or Hero dashboard ─────────── */}
      <AnimatePresence mode="wait">
        {isShowingResults ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
              <h2 className="text-2xl font-bold">
                {platform
                  ? platform.charAt(0).toUpperCase() + platform.slice(1)
                  : "Search results"}
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-400 font-medium">
                  {filtered.length} of {allProfiles.length} creators
                </p>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-black transition-colors border border-black/10 hover:border-black px-3 py-1.5 rounded-full"
                  aria-label="Back to home"
                >
                  <X size={14} strokeWidth={3} /> Back
                </button>
              </div>
            </div>
            <ProfileList
              profiles={filtered}
              platform={platform || undefined}
              searchQuery={searchQuery}
              onProfileClick={() => { }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero product mockup */}
            <HeroDashboardMockup />

            {/* ── FEATURE 1: Search Discovery ─────────────────── */}
            <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-white mt-32 border-y border-black/5 py-24">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="text-left max-w-lg">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Search Discovery</div>
                  <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-6">
                    Search smarter,<br />not harder.
                  </h2>
                  <p className="text-lg text-gray-500 mb-8 leading-relaxed font-medium">
                    Filter by platform, engagement rate, follower count and category. Find the exact creator your brand needs in seconds — not hours.
                  </p>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setTimeout(() => document.getElementById("main-search")?.focus(), 100);
                    }}
                    className="flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <Search size={16} /> Try a search
                  </button>
                </div>
                {/* Product UI mockup */}
                <div className="bg-[#1a1a2e] rounded-2xl shadow-[0_32px_60px_rgba(0,0,0,0.18)] overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3.5 bg-[#111122] border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <div className="ml-3 flex-1 bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 font-mono">wobb.ai/search</div>
                  </div>
                  <div className="bg-[#FAF8F4] p-5 space-y-3">
                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2.5 border border-black/5 shadow-sm">
                      <Search size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-400 font-medium flex-1">lifestyle, 1M+ followers</span>
                      <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md">Search</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {["All", "Instagram", "Verified ✓"].map((f, i) => (
                        <span key={f} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${i === 0 ? "bg-black text-white border-black" : "bg-white text-gray-500 border-black/10"}`}>{f}</span>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {MOCK_CREATORS.map((c) => (
                        <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-black/5">
                          <img 
                            src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`} 
                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`; }}
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-black truncate">{c.name}</div>
                            <div className="text-xs text-gray-400 truncate">{c.handle}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-sm text-black">{c.followers}</div>
                            <div className="text-xs font-bold text-green-500">{c.engagement}</div>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer shrink-0">
                            <Plus size={14} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── FEATURE 2: Campaign List ─────────────────────── */}
            <div className="py-24">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <CampaignListMockup />
                </div>
                <div className="text-left max-w-lg order-1 lg:order-2">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Campaign Lists</div>
                  <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-6">
                    Say goodbye to<br />spreadsheets.
                  </h2>
                  <p className="text-lg text-gray-500 mb-8 leading-relaxed font-medium">
                    Collect your favourite creators into curated lists, view total reach, average engagement, and brand safety — all in one place.
                  </p>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setTimeout(() => document.getElementById("main-search")?.focus(), 100);
                    }}
                    className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors text-lg"
                  >
                    Start building your list →
                  </button>
                </div>
              </div>
            </div>

            {/* ── FEATURE 3: Creator Comparison ───────────────── */}
            <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-white border-y border-black/5 py-24">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Verified Creators</div>
                  <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
                    Work with creators you can actually trust.
                  </h2>
                  <p className="text-lg text-gray-500 font-medium">
                    Every creator is verified and scored for brand safety, engagement authenticity, and audience quality.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {MOCK_CREATORS.map((c) => <CreatorComparisonCard key={c.id} creator={c} />)}
                </div>
              </div>
            </div>

            {/* ── TESTIMONIALS ─────────────────────────────────── */}
            <div className="py-24 max-w-7xl mx-auto px-6">
              <div className="text-center mb-14">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Testimonials</div>
                <h2 className="text-4xl font-black text-black">Brands love Wobb.</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: "Sarah Chen", role: "Head of Marketing, Casper", avatar: "https://i.pravatar.cc/150?img=5", quote: "We cut our influencer research time from 2 days to 20 minutes. The engagement data alone is worth it.", img: 5 },
                  { name: "James Park", role: "Brand Director, SeatGeek", avatar: "https://i.pravatar.cc/150?img=12", quote: "The creator verification system gave us confidence we never had with other tools. Zero brand safety issues.", img: 12 },
                  { name: "Layla Morris", role: "Campaign Manager, Typeform", avatar: "https://i.pravatar.cc/150?img=48", quote: "Building a campaign list and seeing total reach instantly changed how we pitch budgets to leadership.", img: 48 },
                ].map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed mb-6">"{t.quote}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                      <img src={t.avatar} className="w-10 h-10 rounded-full object-cover" alt={t.name} />
                      <div>
                        <div className="font-bold text-sm text-black">{t.name}</div>
                        <div className="text-xs text-gray-400 font-medium">{t.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── CTA SECTION ──────────────────────────────────── */}
            <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-[#FAF8F4] border-t border-black/5 py-24 px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-5 max-w-2xl mx-auto leading-tight">
                Run your next influencer campaign smarter.
              </h2>
              <p className="text-gray-500 text-lg font-medium mb-10 max-w-xl mx-auto leading-relaxed">
                Minimize the chaos of managing creators and maximize the impact you can have on your brand.
              </p>
              <button
                onClick={() => toast.success("You're on the list! We'll be in touch soon.", { duration: 4000 })}
                className="inline-block bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors text-base"
              >
                Try 1 month free
              </button>
            </div>

            {/* ── SITE FOOTER ──────────────────────────────────── */}
            <footer className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-[#FAF8F4] border-t border-black/5">
              {/* Main footer grid */}
              <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
                {/* Logo column */}
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 text-xl font-black tracking-tighter mb-4">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-sm">W</span>
                    </div>
                  </div>
                </div>

                {/* Solutions */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-black mb-4">Solutions</h4>
                  <ul className="space-y-3">
                    {["Influencer search", "Campaign lists", "Creator analytics"].map((l) => (
                      <li key={l}><a href="#" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">{l}</a></li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-black mb-4">Resources</h4>
                  <ul className="space-y-3">
                    {["Blog", "Creator guides", "Customer stories", "Podcast", "Community"].map((l) => (
                      <li key={l}><a href="#" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">{l}</a></li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-black mb-4">Company</h4>
                  <ul className="space-y-3">
                    {["About", "Team", "Careers"].map((l) => (
                      <li key={l}><a href="#" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">{l}</a></li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-black mb-4">Support</h4>
                  <ul className="space-y-3">
                    {["Contact", "Request a demo", "Sign up", "Log in", "Become a partner"].map((l) => (
                      <li key={l}><a href="#" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">{l}</a></li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="max-w-7xl mx-auto px-6 py-6 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-400 font-medium">
                  Handcrafted with care · Wobb Inc. © 2026
                </p>
                <div className="flex items-center gap-6">
                  <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors font-medium">Terms</a>
                  <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors font-medium">Privacy</a>
                </div>
                {/* Social icon circles */}
                <div className="flex items-center gap-3">
                  {["f", "✦", "✕", "in"].map((icon) => (
                    <a
                      key={icon}
                      href="#"
                      className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-xs font-black text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
