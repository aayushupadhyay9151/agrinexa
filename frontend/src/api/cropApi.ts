import { apiRequest } from './client.js';
import { CropProfile } from '../types/index.js';

export const cropApi = {
  getAllCrops: () =>
    apiRequest<{ success: boolean; count: number; crops: CropProfile[] }>('/crops'),

  getCropById: (id: string) =>
    apiRequest<{ success: boolean; crop: CropProfile }>(`/crops/${id}`)
};
