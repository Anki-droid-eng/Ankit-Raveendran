export type Sex = 'male' | 'female';

export type TrainingLevel = 'light' | 'moderate' | 'heavy' | 'very_heavy';

export type Goal = 'lose' | 'maintain' | 'gain';

export interface AthleteProfile {
  sex: Sex | null;
  age: number | '';
  height: number | '';
  weight: number | '';
  trainingLevel: TrainingLevel | null;
  goal: Goal | null;
}

export interface PlanResults {
  bmr: number;
  maintenanceCalories: number;
  targetCalories: number;
  proteinG: number;
  proteinPerKg: number;
  fatG: number;
  carbsG: number;
  waterL: number;
  mealSplitKcal: number;
  preEventCarbsMin: number;
  preEventCarbsMax: number;
  calorieBreakdown: {
    proteinCalories: number;
    carbsCalories: number;
    fatCalories: number;
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
}

export interface FoodItem {
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface FoodCategory {
  category: string;
  items: FoodItem[];
}

export interface FoodLogEntry {
  id: string;
  name: string;
  servings: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  timestamp: number;
}
