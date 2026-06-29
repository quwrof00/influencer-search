import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useProfileStore } from "@/store/useProfileStore";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const { selectedProfiles, addProfile, removeProfile } = useProfileStore();
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) return;
    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) return null;

  if (!loaded) {
    return (
      <Layout>
        <div className="w-full flex justify-center py-32">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="text-center py-32">
          <p className="text-xl font-bold mb-4">Profile not found</p>
          <button onClick={() => navigate("/")} className="text-black font-semibold border-b-2 border-black pb-1">
            Go back to search
          </button>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const identifier = user.username || user.handle || user.user_id;
  const isSelected = selectedProfiles.some((p) => p.user_id === user.user_id);

  const handleToggleList = () => {
    if (isSelected) removeProfile(user.user_id);
    else addProfile(user);
  };

  return (
    <Layout title={user.fullname}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black mb-12 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-black/5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=random`}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=random`;
              }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#FAF8F4] shadow-sm"
              alt={user.fullname}
            />
            
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-black flex items-center gap-2 mb-2">
                    @{identifier}
                    <VerifiedBadge verified={user.is_verified} />
                  </h1>
                  <h2 className="text-xl text-gray-600 font-medium">{user.fullname}</h2>
                </div>
                <button
                  className={`px-6 py-3 font-bold rounded-lg transition-all ${
                    isSelected
                      ? "bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
                      : "bg-white text-black border-2 border-black hover:bg-gray-50"
                  }`}
                  onClick={handleToggleList}
                >
                  {isSelected ? "Remove from List" : "Add to List"}
                </button>
              </div>

              {user.description && (
                <p className="text-gray-700 leading-relaxed mb-8 max-w-2xl text-lg">
                  {user.description}
                </p>
              )}

              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-black border-b-2 border-black pb-1 hover:opacity-70 transition-opacity mb-10"
                >
                  View on {platform} <ExternalLink size={16} />
                </a>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Followers" value={formatFollowersDetail(user.followers)} />
                <StatCard 
                  label="Engagement Rate" 
                  value={user.engagement_rate !== undefined ? (user.engagement_rate * 100).toFixed(2) + "%" : "N/A"} 
                />
                {user.avg_views !== undefined && user.avg_views > 0 && (
                  <StatCard label="Avg Views" value={formatFollowersDetail(user.avg_views)} />
                )}
                {user.posts_count !== undefined && (
                  <StatCard label="Posts" value={user.posts_count.toString()} />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#FAF8F4] p-4 rounded-xl border border-black/5">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-black text-black">{value}</div>
    </div>
  );
}
