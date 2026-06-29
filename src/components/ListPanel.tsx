import { useProfileStore } from "@/store/useProfileStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ListPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ListPanel({ isOpen, onClose }: ListPanelProps) {
  const { selectedProfiles, removeProfile, clearProfiles } =
    useProfileStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/25 z-40"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ right: "-100%" }}
            animate={{ right: 0 }}
            exit={{ right: "-100%" }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <div>
                <h2 className="font-black text-black text-lg">My Campaign List</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {selectedProfiles.length === 0
                    ? "No creators added yet"
                    : `${selectedProfiles.length} creator${selectedProfiles.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                aria-label="Close panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {selectedProfiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-16">
                  <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center text-3xl">
                    🎯
                  </div>
                  <div>
                    <p className="font-bold text-black mb-1">Your list is empty</p>
                    <p className="text-sm text-gray-400 font-medium mb-6">
                      Search for creators and hit the + button to add them here.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        // wait for panel to close then focus
                        setTimeout(() => {
                          document.getElementById("main-search")?.focus();
                          // optionally scroll to top
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                      className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
                    >
                      Search Creators
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 rounded-xl p-1">
                  {selectedProfiles.map((profile, index) => {
                    const identifier = profile.username || profile.handle || profile.user_id;
                    return (
                      <div
                        key={profile.user_id}
                        className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-black/5 shadow-sm transition-all hover:border-black/20"
                      >
                        {/* Priority badge */}
                        <span className="text-xs font-black text-gray-300 w-5 text-center shrink-0">
                          {index + 1}
                        </span>

                        <img
                          src={profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=random`}
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=random`;
                          }}
                          alt={identifier}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-black truncate">
                            {profile.fullname || identifier}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            @{identifier}
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeProfile(profile.user_id)}
                          className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-black transition-colors shrink-0"
                          aria-label={`Remove ${identifier}`}
                        >
                          <X size={13} strokeWidth={3} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {selectedProfiles.length > 0 && (
              <div className="px-6 py-5 border-t border-black/5 space-y-3">
                <button
                  onClick={() => toast.info("Campaign launching is coming soon! We'll notify you when it's ready.", { duration: 4000 })}
                  className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Launch Campaign →
                </button>
                <button
                  onClick={clearProfiles}
                  className="w-full py-3 text-sm font-semibold text-gray-400 hover:text-black transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
