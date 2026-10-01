import React from 'react';
import { PlanResults, AthleteProfile } from '../types';
import { RotateCcw, Droplets, Dumbbell, Flame, Sparkles } from 'lucide-react';

interface ResultsProps {
  plan: PlanResults;
  profile: AthleteProfile;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ plan, profile, onReset }) => {
  const {
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
    calorieBreakdown,
  } = plan;

  const ariaLabelText = `Calorie split: ${calorieBreakdown.proteinPercent}% protein, ${calorieBreakdown.carbsPercent}% carbs, ${calorieBreakdown.fatPercent}% fat`;

  return (
    <div className="w-full max-w-[640px] mx-auto space-y-6">
      {/* Top Banner Card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-6">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] font-condensed">
              Personalized Fuel Plan
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-condensed tracking-tight text-[var(--text-primary)]">
              Daily Target Calories
            </h1>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="self-start sm:self-auto py-2 px-3.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] text-sm font-semibold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#0F6B6B] focus-visible:outline-none"
            aria-label="Start over and reset plan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start over</span>
          </button>
        </div>

        {/* Large Headline Number */}
        <div className="text-center py-2 mb-6">
          <div className="text-6xl sm:text-7xl font-extrabold font-condensed tracking-tight text-[#0F6B6B] dark:text-[#179696] leading-none">
            {targetCalories.toLocaleString()}
          </div>
          <div className="text-base sm:text-lg font-condensed font-semibold tracking-wide text-[var(--text-secondary)] mt-2 uppercase">
            Kilocalories / Day
          </div>
        </div>

        {/* Two Stat Boxes: BMR & Maintenance */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-condensed mb-1">
              Basal Metabolic Rate (BMR)
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-condensed text-[var(--text-primary)]">
              {bmr.toLocaleString()} <span className="text-sm font-normal text-[var(--text-muted)]">kcal</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Mifflin-St Jeor baseline</div>
          </div>

          <div className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-condensed mb-1">
              Maintenance Energy
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-condensed text-[var(--text-primary)]">
              {maintenanceCalories.toLocaleString()} <span className="text-sm font-normal text-[var(--text-muted)]">kcal</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Includes training load</div>
          </div>
        </div>

        {/* Stacked Horizontal Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold font-condensed uppercase tracking-wider text-[var(--text-secondary)]">
              Macronutrient Calorie Split
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {calorieBreakdown.proteinPercent}% P · {calorieBreakdown.carbsPercent}% C · {calorieBreakdown.fatPercent}% F
            </span>
          </div>

          {/* Stacked Bar with accessible aria-label */}
          <div
            className="w-full h-5 rounded-lg overflow-hidden flex bg-[var(--border-color)]"
            aria-label={ariaLabelText}
            role="img"
          >
            <div
              style={{ width: `${calorieBreakdown.proteinPercent}%` }}
              className="bg-[#0F6B6B] dark:bg-[#179696] h-full transition-all"
              title={`Protein: ${calorieBreakdown.proteinPercent}%`}
            />
            <div
              style={{ width: `${calorieBreakdown.carbsPercent}%` }}
              className="bg-[#F2A900] h-full transition-all"
              title={`Carbohydrates: ${calorieBreakdown.carbsPercent}%`}
            />
            <div
              style={{ width: `${calorieBreakdown.fatPercent}%` }}
              className="bg-[#8A5CF5] h-full transition-all"
              title={`Fat: ${calorieBreakdown.fatPercent}%`}
            />
          </div>

          {/* Bar Legend */}
          <div className="flex items-center justify-between text-xs font-medium mt-2 px-1 text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0F6B6B] dark:bg-[#179696]" />
              <span>Protein ({calorieBreakdown.proteinCalories} kcal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F2A900]" />
              <span>Carbs ({calorieBreakdown.carbsCalories} kcal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#8A5CF5]" />
              <span>Fat ({calorieBreakdown.fatCalories} kcal)</span>
            </div>
          </div>
        </div>

        {/* Rows for Protein, Carbohydrate, Fat and Water */}
        <div className="divide-y divide-[var(--border-color)] border-t border-[var(--border-color)]">
          {/* Protein Row */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#0F6B6B] dark:bg-[#179696]" />
              <div>
                <div className="font-condensed font-bold text-lg leading-tight text-[var(--text-primary)]">
                  Protein
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Calibrated at {proteinPerKg.toFixed(1)} g/kg body weight
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-condensed font-bold text-xl text-[var(--text-primary)]">
                {proteinG} g
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {calorieBreakdown.proteinCalories} kcal
              </div>
            </div>
          </div>

          {/* Carbohydrate Row */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#F2A900]" />
              <div>
                <div className="font-condensed font-bold text-lg leading-tight text-[var(--text-primary)]">
                  Carbohydrate
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Primary glycolytic muscle fuel
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-condensed font-bold text-xl text-[var(--text-primary)]">
                {carbsG} g
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {calorieBreakdown.carbsCalories} kcal
              </div>
            </div>
          </div>

          {/* Fat Row */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#8A5CF5]" />
              <div>
                <div className="font-condensed font-bold text-lg leading-tight text-[var(--text-primary)]">
                  Fat
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Hormonal support & endurance substrate
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-condensed font-bold text-xl text-[var(--text-primary)]">
                {fatG} g
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {calorieBreakdown.fatCalories} kcal
              </div>
            </div>
          </div>

          {/* Water Row */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <div className="font-condensed font-bold text-lg leading-tight text-[var(--text-primary)]">
                  Water & Hydration
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  0.035 × body weight + workout sweat allocation
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-condensed font-bold text-xl text-[var(--text-primary)]">
                {waterL} L
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                daily baseline
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Short Tips Card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] font-condensed mb-2">
          Nutritional Strategy
        </div>
        <h2 className="text-xl font-bold font-condensed tracking-tight text-[var(--text-primary)] mb-4">
          Athlete Guidance Tips
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {/* Tip 1 */}
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-condensed font-bold text-base text-[var(--text-primary)] mb-1.5">
                <Flame className="w-4 h-4 text-[#0F6B6B] dark:text-[#179696]" />
                <span>Meal Distribution</span>
              </div>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                Split energy across 4 feedings: aim for approximately <strong>{mealSplitKcal} kcal</strong> per main meal to maintain steady amino acid and glucose availability.
              </p>
            </div>
          </div>

          {/* Tip 2 */}
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-condensed font-bold text-base text-[var(--text-primary)] mb-1.5">
                <Dumbbell className="w-4 h-4 text-[#F2A900]" />
                <span>Post-Workout Timing</span>
              </div>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                Consume high-glycemic carbohydrates and <strong>20–30 g protein</strong> within 2 hours of training to accelerate glycogen replenishment and muscle recovery.
              </p>
            </div>
          </div>

          {/* Tip 3 */}
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-condensed font-bold text-base text-[var(--text-primary)] mb-1.5">
                <Sparkles className="w-4 h-4 text-[#8A5CF5]" />
                <span>Pre-Event Fueling</span>
              </div>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                Load carbs at <strong>1.2–2 g per kg ({preEventCarbsMin}–{preEventCarbsMax} g)</strong> roughly 3–4 hours before long athletic events for maximal endurance capacity.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical & Adjustment Disclaimer */}
        <div className="mt-5 p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] leading-relaxed">
          <strong className="text-[var(--text-secondary)]">Important note:</strong> These numbers are starting estimates. Monitor your body weight trend over 2–3 weeks and adjust intake by 100–200 kcal as needed. For clinical conditions or medical management, please consult a registered sports dietitian.
        </div>
      </div>
    </div>
  );
};
