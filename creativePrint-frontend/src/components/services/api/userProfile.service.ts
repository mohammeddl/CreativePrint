import { api } from "./axios";
import type { UserProfile } from "../../../types/user";

export const userProfileService = {
  getUserProfile: async (userId: string) => {
    const response = await api.get<UserProfile>(`/users/${userId}/profile`);
    return response.data;
  },

  updateUserProfile: async (userId: string, profileData: FormData) => {
    const response = await api.patch<UserProfile>(
      `/users/${userId}/profile`, 
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
}