// src/services/dto/save-stats.dto.ts

export interface PlayerStatsDTO {
    levelId: string;
    playerName: string;
    likedLevel: boolean;
    completionTime?: number; // Optional: example of another stat
    createdAt: string;
  }