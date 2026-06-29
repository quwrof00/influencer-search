import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useProfileStore } from "@/store/useProfileStore";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
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

  const handleClick = () => {
    if (onProfileClick) onProfileClick(identifier);
    navigate(`/profile/${identifier}?platform=${platform}`);
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
      className="flex items-center gap-3 p-3 border border-gray-300 mb-2 cursor-pointer hover:bg-gray-50 w-[700px] transition-colors"
      data-search={searchQuery}
    >
      <img src={profile.picture} className="w-12 h-12 rounded-full object-cover" alt={profile.fullname} />
      <div className="text-left flex-1">
        <div className="font-bold flex items-center gap-1">
          @{identifier}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-gray-600">{profile.fullname}</div>
        <div className="text-sm text-gray-500">{formatFollowersLocal(profile.followers)}</div>
      </div>
      <button
        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
          isSelected
            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={handleToggleList}
      >
        {isSelected ? "Remove" : "Add to List"}
      </button>
    </div>
  );
}
