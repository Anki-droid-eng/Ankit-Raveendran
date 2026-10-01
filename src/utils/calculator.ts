import { AthleteProfile, PlanResults, TrainingLevel, Goal } from '../types';

export const TRAINING_LEVEL_DETAILS: Record<
  TrainingLevel,
  { label: string; desc: string; multiplier: number; waterOffset: number }
> = {
  light: {
    label: 'Light',
    desc: '1–3 sessions a week (multiplier 1.375)',
    multiplier: 1.375,
    waterOffset: 0.4,
  },
  moderate: {
    label: 'Moderate',
    desc: '3–5 sessions a week (multiplier 1.55)',
    multiplier: 1.55,
    waterOffset: 0.6,
  },
  heavy: {
    label: 'Heavy',
    desc: '6–7 sessions a week (multiplier 1.725)',
    multiplier: 1.725,
    waterOffset: 0.8,
  },
  very_heavy: {
    label: 'Very heavy',
    desc: 'Two sessions a day or a physical job on top (multiplier 1.9)',
    multiplier: 1.9,
    waterOffset: 1.0,
  },
};

export const GOAL_DETAILS: Record<
  Goal,
  { label: string; desc: string; calorieFactor: number; proteinPerKg: number }
> = {
  lose: {
    label: 'Lose fat',
    desc: 'About 15% below maintenance',
    calorieFactor: 0.85,
    proteinPerKg: 2.0,
  },
  maintain: {
    label: 'Maintain weight',
    desc: 'Matches your daily energy expenditure',
    calorieFactor: 1.0,
    proteinPerKg: 1.6,
  },
  gain: {
    label: 'Build muscle',
    desc: 'About 10% above maintenance',
    calorieFactor: 1.1,
    proteinPerKg: 1.8,
  },
};

export function calculatePlan(profile: AthleteProfile): PlanResults {
  const weight = Number(profile.weight);
  const height = Number(profile.height);
  const age = Number(profile.age);
  const sex = profile.sex || 'male';
  const trainingLevel = profile.trainingLevel || 'moderate';
  const goal = profile.goal || 'maintain';

  // Mifflin-St Jeor formula
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (sex === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  bmr = Math.round(bmr);

  const trainingInfo = TRAINING_LEVEL_DETAILS[trainingLevel];
  const goalInfo = GOAL_DETAILS[goal];

  const maintenanceCalories = Math.round(bmr * trainingInfo.multiplier);
  const targetCalories = Math.round(maintenanceCalories * goalInfo.calorieFactor);

  const proteinPerKg = goalInfo.proteinPerKg;
  const proteinG = Math.round(weight * proteinPerKg);

  const minFatFromPercent = (0.25 * targetCalories) / 9;
  const minFatFromWeight = 0.8 * weight;
  const fatG = Math.round(Math.max(minFatFromPercent, minFatFromWeight));

  const remainingKcalForCarbs = targetCalories - proteinG * 4 - fatG * 9;
  const carbsG = Math.round(Math.max(0, remainingKcalForCarbs / 4));

  const rawWater = 0.035 * weight + trainingInfo.waterOffset;
  const waterL = Number(rawWater.toFixed(1));

  const mealSplitKcal = Math.round(targetCalories / 4);
  const preEventCarbsMin = Math.round(1.2 * weight);
  const preEventCarbsMax = Math.round(2.0 * weight);

  const proteinCalories = proteinG * 4;
  const carbsCalories = carbsG * 4;
  const fatCalories = fatG * 9;
  const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

  const proteinPercent = totalMacroCalories > 0 ? Math.round((proteinCalories / totalMacroCalories) * 100) : 0;
  const carbsPercent = totalMacroCalories > 0 ? Math.round((carbsCalories / totalMacroCalories) * 100) : 0;
  const fatPercent = totalMacroCalories > 0 ? Math.max(0, 100 - proteinPercent - carbsPercent) : 0;

  return {
    bmr,
    maintenanceCalories,
    targetCalories,
    proteinG,
    proteinPerKg,
    fatG,
    carbsG,
    waterL,
    mealSplitKcal,
    preEventCarbsMin,
    preEventCarbsMax,
    calorieBreakdown: {
      proteinCalories,
      carbsCalories,
      fatCalories,
      proteinPercent,
      carbsPercent,
      fatPercent,
    },
  };
}
