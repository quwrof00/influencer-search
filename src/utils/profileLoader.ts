import type { ProfileDetailResponse } from "@/types";
import { PLATFORMS, getSearchData } from "@/utils/dataHelpers";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (loader) {
    const result = await loader();
    const data =
      (result as { default?: ProfileDetailResponse }).default ?? result;
    return data as ProfileDetailResponse;
  }

  // Fallback: search in platform summaries
  for (const platform of PLATFORMS) {
    const data = getSearchData(platform);
    if (!data) continue;
    
    const summary = data.accounts.find(
      (a) =>
        a.account.user_profile.username === username ||
        a.account.user_profile.handle === username ||
        a.account.user_profile.user_id === username
    );
    
    if (summary) {
      return {
        data: {
          success: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          user_profile: summary.account.user_profile as any,
        }
      } as ProfileDetailResponse;
    }
  }

  return null;
}
