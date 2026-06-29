import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useProfileStore } from "@/store/useProfileStore";
import { Plus, Minus } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform?: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M followers";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K followers";
  return count + " followers";
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { selectedProfiles, addProfile, removeProfile } = useProfileStore();
  const isSelected = selectedProfiles.some((p) => p.user_id === profile.user_id);

  const identifier = profile.username || profile.handle || profile.user_id;

  const displayPlatform = profile.platform || platform || "instagram";

  const handleClick = () => {
    if (onProfileClick) onProfileClick(identifier);
    navigate(`/profile/${identifier}?platform=${displayPlatform}`);
  };

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      removeProfile(profile.user_id);
    } else {
      addProfile(profile);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col p-6 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full border border-black/5 rounded-xl"
      data-search={searchQuery}
    >
      <div className="flex items-start justify-between">
        <img 
          src={profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=random`} 
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=random`;
          }}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#FAF8F4]" 
          alt={profile.fullname || identifier} 
        />
        
        <button
          className={`p-2 rounded-full border transition-colors ${
            isSelected
              ? "bg-black text-white border-black hover:bg-gray-800"
              : "bg-white text-black border-black/10 hover:border-black"
          }`}
          onClick={handleToggleList}
          aria-label={isSelected ? "Remove from list" : "Add to list"}
        >
          {isSelected ? <Minus size={16} /> : <Plus size={16} />}
        </button>
      </div>

      <div className="mt-4 text-left flex-1">
        <div className="font-black text-lg text-black flex items-center gap-1 leading-tight">
          @{identifier}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm font-medium text-gray-500 mt-1">{profile.fullname}</div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-center">
        <div className="text-sm font-bold text-black">{formatFollowersLocal(profile.followers)}</div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{displayPlatform}</div>
      </div>
    </div>
  );
}
