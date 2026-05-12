import axios from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdHome, MdMovie, MdMusicNote, MdSearch, MdAdd, MdDelete,
  MdStar, MdVisibility, MdVisibilityOff, MdSort, MdFilterList,
  MdClose, MdTv, MdCheck, MdOutlineAutoAwesome
} from "react-icons/md";
import { GiSwordman } from "react-icons/gi";

// ─── Theme configs ────────────────────────────────────────────────────────────
const THEMES = {
  home: {
    bg: "from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]",
    orb1: "bg-indigo-900/30",
    orb2: "bg-violet-900/20",
    orb3: "bg-blue-900/20",
    accent: "#818cf8",
    glow: "shadow-indigo-500/20",
    ring: "ring-indigo-500/30",
    btn: "from-indigo-600 to-violet-600",
    label: "text-indigo-400",
  },
  anime: {
    bg: "from-[#0a0806] via-[#130a0a] to-[#060810]",
    orb1: "bg-orange-900/30",
    orb2: "bg-blue-900/25",
    orb3: "bg-amber-900/20",
    accent: "#fb923c",
    glow: "shadow-orange-500/20",
    ring: "ring-orange-500/30",
    btn: "from-orange-600 to-amber-500",
    label: "text-orange-400",
  },
  movies: {
    bg: "from-[#080806] via-[#100e08] to-[#080808]",
    orb1: "bg-yellow-900/25",
    orb2: "bg-amber-900/20",
    orb3: "bg-stone-800/30",
    accent: "#fbbf24",
    glow: "shadow-yellow-500/20",
    ring: "ring-yellow-500/30",
    btn: "from-yellow-600 to-amber-600",
    label: "text-yellow-400",
  },
  series: {
    bg: "from-[#0a0608] via-[#120808] to-[#08080a]",
    orb1: "bg-red-900/30",
    orb2: "bg-rose-900/20",
    orb3: "bg-red-800/15",
    accent: "#f87171",
    glow: "shadow-red-500/20",
    ring: "ring-red-500/30",
    btn: "from-red-700 to-rose-600",
    label: "text-red-400",
  },
  music: {
    bg: "from-[#080610] via-[#0e0816] to-[#08060e]",
    orb1: "bg-purple-900/30",
    orb2: "bg-pink-900/25",
    orb3: "bg-fuchsia-900/20",
    accent: "#e879f9",
    glow: "shadow-fuchsia-500/20",
    ring: "ring-fuchsia-500/30",
    btn: "from-purple-600 to-fuchsia-600",
    label: "text-fuchsia-400",
  },
};

const TABS = [
  { id: "home",   label: "Home",    icon: MdHome,      type: null },
  { id: "anime",  label: "Anime",   icon: GiSwordman,  type: "Anime" },
  { id: "movies", label: "Movies",  icon: MdMovie,     type: "Movie" },
  { id: "series", label: "Series",  icon: MdTv,        type: "Series" },
  { id: "music",  label: "Music",   icon: MdMusicNote, type: "Music" },
];

const FILTERS = ["All", "Anime", "Movie", "Series", "Music", "Watched", "Unwatched"];
const SORTS = ["Newest", "Oldest", "Top Rated"];



// ─── Animated background ─────────────────────────────────────────────────────
function CinematicBg({ theme }) {
  const t = THEMES[theme];
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${t.bg} transition-all duration-700`} />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-60 ${t.orb1}`}
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className={`absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full blur-[100px] opacity-50 ${t.orb2}`}
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 50, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        className={`absolute -bottom-24 left-1/3 w-[350px] h-[350px] rounded-full blur-[90px] opacity-40 ${t.orb3}`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ active, onChange }) {
  const t = THEMES[active];
  return (
    <>
      {/* Desktop top bar */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 py-4">
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-2.5 flex items-center gap-2">
          <MdOutlineAutoAwesome style={{ color: t.accent }} className="text-xl" />
          <span className="font-bold tracking-widest text-white/90 text-sm uppercase">MediaVault</span>
        </div>
        <nav className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl flex items-center gap-1 px-2 py-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${t.btn} opacity-80`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="text-base" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile bottom bar */}
      <div className="flex md:hidden fixed bottom-4 left-4 right-4 z-50">
        <nav className="w-full backdrop-blur-xl bg-black/60 border border-white/10 rounded-3xl flex items-center justify-around px-2 py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300 ${
                  isActive ? "text-white" : "text-white/35 hover:text-white/60"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mob-pill"
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${t.btn} opacity-70`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 text-xl" />
                <span className="relative z-10 text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ theme }) {
  const t = THEMES[theme];
  const taglines = {
    home: "Your personal universe of entertainment",
    anime: "Feel the chakra. Embrace the arc.",
    movies: "Cinematic gold. Epic scale. Eternal glory.",
    series: "Every episode. Every twist. Catalogued.",
    music: "Synthwave soul. Neon frequency. Pure vibe.",
  };
  return (
    <div className="text-center pt-6 pb-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 backdrop-blur-md bg-white/[0.06] border border-white/10 rounded-full px-4 py-1.5 mb-4"
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: t.accent }} />
        <span className="text-xs font-medium text-white/50 tracking-widest uppercase">
          {taglines[theme]}
        </span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl md:text-6xl font-black tracking-tight text-white mb-1"
        style={{ textShadow: `0 0 60px ${t.accent}44` }}
      >
        MEDIA<span style={{ color: t.accent }}>VAULT</span>
      </motion.h1>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats({ items, theme }) {
  const t = THEMES[theme];
  const total = items.length;
  const watched = items.filter((i) => i.watched).length;
  const unwatched = total - watched;
  const avg = total ? (items.reduce((s, i) => s + i.rating, 0) / total).toFixed(1) : "—";
  const stats = [
    { label: "Total", value: total },
    { label: "Watched", value: watched },
    { label: "Unwatched", value: unwatched },
    { label: "Avg ★", value: avg },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className={`backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-center hover:border-white/20 transition-all hover:${t.glow} hover:shadow-lg`}
        >
          <div className="text-2xl font-black text-white" style={{ textShadow: `0 0 20px ${t.accent}66` }}>
            {s.value}
          </div>
          <div className="text-xs text-white/40 font-medium mt-0.5 uppercase tracking-wider">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── AddForm ──────────────────────────────────────────────────────────────────
function AddForm({ onAdd, theme, defaultType }) {
  const t = THEMES[theme];
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(defaultType || "Movie");
  const [rating, setRating] = useState(8);

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), type, rating: Number(rating), watched: false});
    setTitle(""); setRating(8); setOpen(false);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r ${t.btn} text-white font-semibold text-sm shadow-lg transition-all hover:opacity-90 hover:shadow-xl`}
        style={{ boxShadow: `0 0 20px ${t.accent}33` }}
      >
        <MdAdd className="text-lg" /> Add Media
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-md backdrop-blur-2xl bg-white/[0.07] border border-white/15 rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Add to Vault</h2>
                <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <MdClose className="text-xl" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider ${t.label} mb-1.5 block`}>Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="Enter title..."
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider ${t.label} mb-1.5 block`}>Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["Anime", "Movie", "Series", "Music"].map((tp) => (
                      <button
                        key={tp}
                        onClick={() => setType(tp)}
                        className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                          type === tp
                            ? `bg-gradient-to-r ${t.btn} text-white`
                            : "bg-white/[0.05] text-white/40 hover:text-white/70 border border-white/10"
                        }`}
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider ${t.label} mb-1.5 flex items-center justify-between`}>
                    <span>Rating</span>
                    <span className="text-white font-black text-base">{rating} / 10</span>
                  </label>
                  <input
                    type="range" min="1" max="10" value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full accent-current h-1.5 rounded-full"
                    style={{ accentColor: t.accent }}
                  />
                </div>
                <button
                  onClick={submit}
                  className={`w-full py-3 rounded-2xl bg-gradient-to-r ${t.btn} text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all`}
                  style={{ boxShadow: `0 0 24px ${t.accent}44` }}
                >
                  Add to Vault
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── MediaCard ────────────────────────────────────────────────────────────────
const TYPE_ICONS = { Anime: GiSwordman, Movie: MdMovie, Series: MdTv, Music: MdMusicNote };

function MediaCard({ item, onToggle, onDelete,setDeleteItemId, theme }) {
  const t = THEMES[theme];
  const Icon = TYPE_ICONS[item.type] || MdMovie;

  const TYPE_COLORS = {
    Anime: "from-orange-600/80 to-amber-500/80",
    Movie: "from-yellow-600/80 to-amber-600/80",
    Series: "from-red-700/80 to-rose-600/80",
    Music: "from-purple-600/80 to-fuchsia-600/80",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`relative group backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:shadow-xl hover:${t.glow}`}
      style={{ boxShadow: item.watched ? `0 0 30px ${t.accent}15` : "none" }}
    >
      {/* Type banner */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${TYPE_COLORS[item.type] || t.btn}`} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${TYPE_COLORS[item.type]} flex items-center justify-center`}>
            <Icon className="text-white text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-sm text-white truncate ${item.watched ? "opacity-60 line-through decoration-white/30" : ""}`}>
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-white/35 font-medium uppercase tracking-wider">{item.type}</span>
              <span className="text-[10px] text-white/20">•</span>
              <div className="flex items-center gap-0.5">
                <MdStar className="text-yellow-400 text-xs" />
                <span className="text-xs text-white/60 font-semibold">{item.rating}/10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onToggle(item._id, item.watched)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              item.watched
                ? `bg-gradient-to-r ${t.btn} text-white opacity-80 hover:opacity-100`
                : "bg-white/[0.06] text-white/40 hover:text-white/70 border border-white/10"
            }`}
          >
            {item.watched ? <MdCheck className="text-sm" /> : <MdVisibilityOff className="text-sm" />}
            {item.watched ? "Watched" : "Unwatched"}
          </button>
          <button
            onClick={() => setDeleteItemId(item._id)}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.04] text-white/25 hover:bg-red-500/20 hover:text-red-400 border border-white/8 transition-all"
          >
            <MdDelete className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ theme }) {
  const t = THEMES[theme];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 text-4xl"
        style={{ background: `${t.accent}15`, boxShadow: `0 0 40px ${t.accent}20` }}
      >
        🎬
      </div>
      <h3 className="text-xl font-bold text-white/70 mb-2">Your vault is empty</h3>
      <p className="text-sm text-white/30 max-w-xs">Start building your personal media universe. Add anime, movies, series, or music.</p>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [media, setMedia] = useState([]);
  const [sort, setSort] = useState("Newest");
  const [showSort, setShowSort] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [undoItem, setUndoItem] = useState(null);
const [undoTimeout, setUndoTimeout] = useState(null);

  const fetchMedia = async () => {
    try {
      const response = await axios.get("http://localhost:5000/media");

      console.log(response.data);

      setMedia(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);


  const theme = tab;
  const t = THEMES[theme];

  const defaultType = {
    anime: "Anime",
    movies: "Movie",
    series: "Series",
    music: "Music",
  }[tab] || "Movie";

const addItem = async (item) => {
  try {
    await axios.post("http://localhost:5000/media", item);

    fetchMedia();

  } catch (error) {
    console.log(error);
  }
};

const toggleItem = async (id, watched) => {
  try {
    await axios.put(`http://localhost:5000/media/${id}`, {
      watched: !watched,
    });

    fetchMedia();

  } catch (error) {
    console.log(error);
  }
};

const deleteItem = async (item) => {
  // remove instantly from UI
  setMedia((prev) => prev.filter((i) => i._id !== item._id));

  // store deleted item
  setUndoItem(item);

  // clear previous timeout if exists
  if (undoTimeout) {
    clearTimeout(undoTimeout);
  }

  // start delete timer
  const timeout = setTimeout(async () => {
    try {
      await axios.delete(`http://localhost:5000/media/${item._id}`);

      setUndoItem(null);

    } catch (error) {
      console.log(error);
    }
  }, 5000);

  setUndoTimeout(timeout);
};
const undoDelete = () => {
  if (!undoItem) return;

  // cancel backend delete
  clearTimeout(undoTimeout);

  // restore item
  setMedia((prev) => [undoItem, ...prev]);

  // clear undo state
  setUndoItem(null);
};
  // source items (tab-filtered first)
const sourceItems = useMemo(() => {
  if (tab === "home") return media;

  const typeMap = {
    anime: "Anime",
    movies: "Movie",
    series: "Series",
    music: "Music",
  };

  const ty = typeMap[tab];

  return ty
    ? media.filter((i) => i.type === ty)
    : media;
}, [media, tab]);
const filteredItems = useMemo(() => {
  let result = sourceItems;

  const q = search.toLowerCase().trim();

  if (q)
    result = result.filter((i) =>
      i.title.toLowerCase().includes(q)
    );

  if (filter === "Watched")
    result = result.filter((i) => i.watched);

  else if (filter === "Unwatched")
    result = result.filter((i) => !i.watched);

  else if (["Anime", "Movie", "Series", "Music"].includes(filter))
    result = result.filter((i) => i.type === filter);

  if (sort === "Newest") {
    result = [...result].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  else if (sort === "Oldest") {
    result = [...result].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  else if (sort === "Top Rated") {
    result = [...result].sort((a, b) => b.rating - a.rating);
  }

  return result;

}, [sourceItems, search, filter, sort]);

  return (
    <div className="min-h-screen text-white font-sans">
      <CinematicBg theme={theme} />
      <Navbar active={tab} onChange={(id) => { setTab(id); setFilter("All"); setSearch(""); }} />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-32 md:pt-28 md:pb-8">
        <Hero theme={theme} />
        <Stats items={sourceItems} theme={theme} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your vault..."
              className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors backdrop-blur-xl"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <MdClose />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-sm text-white/60 hover:text-white transition-colors backdrop-blur-xl"
            >
              <MdSort /> {sort}
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  className="absolute right-0 top-12 z-50 backdrop-blur-2xl bg-black/80 border border-white/10 rounded-2xl p-1.5 min-w-[140px]"
                >
                  {SORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSort(s); setShowSort(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${sort === s ? "text-white font-semibold" : "text-white/50 hover:text-white"}`}
                      style={sort === s ? { color: t.accent } : {}}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AddForm onAdd={addItem} theme={theme} defaultType={defaultType} />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide no-scrollbar">
          {(tab === "home" ? FILTERS : ["All", "Watched", "Unwatched"]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f
                  ? `bg-gradient-to-r ${t.btn} text-white shadow-md`
                  : "bg-white/[0.05] text-white/35 hover:text-white/60 border border-white/10"
              }`}
              style={filter === f ? { boxShadow: `0 0 12px ${t.accent}33` } : {}}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <EmptyState theme={theme} key="empty" />
            ) : (
              filteredItems.map((item) => (
                <MediaCard
                  key={item._id}
                  item={item}
                  onToggle={toggleItem}
                  onDelete={deleteItem}
                  setDeleteItemId={setDeleteItemId}
                  theme={theme}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
  {deleteItemId && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111]/90 backdrop-blur-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-2">
          Delete Media?
        </h2>

        <p className="text-sm text-white/50 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setDeleteItemId(null)}
            className="flex-1 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white transition-all"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              const itemToDelete = media.find(
  (i) => i._id === deleteItemId
);

await deleteItem(itemToDelete);
              setDeleteItemId(null);
            }}
            className="flex-1 py-3 rounded-2xl bg-red-500/80 hover:bg-red-500 text-white font-semibold transition-all"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
<AnimatePresence>
  {undoItem && (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[300]"
    >
      <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl">
        <span className="text-sm text-white/70">
          Deleted "{undoItem.title}"
        </span>

        <button
          onClick={undoDelete}
          className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
        >
          Undo
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </main>
    </div>
  );
}