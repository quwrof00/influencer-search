import { useProfileStore } from "@/store/useProfileStore";

export function SelectedProfilesList() {
  const { selectedProfiles, removeProfile, clearProfiles } = useProfileStore();

  if (selectedProfiles.length === 0) return null;

  return (
    <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-blue-900">
          Selected Profiles ({selectedProfiles.length})
        </h3>
        <button
          onClick={clearProfiles}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedProfiles.map((profile) => {
          const identifier = profile.username || profile.handle || profile.user_id;
          return (
            <div
              key={profile.user_id}
              className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200 text-sm"
            >
              <img
                src={profile.picture}
                alt={identifier}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="font-medium truncate max-w-[100px]">
                @{identifier}
              </span>
              <button
                onClick={() => removeProfile(profile.user_id)}
                className="text-gray-400 hover:text-red-500 ml-1 font-bold"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
