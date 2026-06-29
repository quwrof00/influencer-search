import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  return (
    <div className="w-full">
      {profiles.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-500 font-medium text-lg">No profiles found matching your search.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.user_id}
            profile={profile}
            platform={platform}
            searchQuery={searchQuery}
            onProfileClick={onProfileClick}
          />
        ))}
      </div>
    </div>
  );
}
