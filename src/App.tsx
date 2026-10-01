/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AthleteProfile, PlanResults, FoodLogEntry } from './types';
import { calculatePlan } from './utils/calculator';
import { Stepper } from './components/Stepper';
import { Results } from './components/Results';
import { FoodTracker } from './components/FoodTracker';
import { Activity } from 'lucide-react';

const INITIAL_PROFILE: AthleteProfile = {
  sex: null,
  age: '',
  height: '',
  weight: '',
  trainingLevel: null,
  goal: null,
};

export default function App() {
  const [profile, setProfile] = useState<AthleteProfile>(INITIAL_PROFILE);
  const [plan, setPlan] = useState<PlanResults | null>(null);
  const [foodLog, setFoodLog] = useState<FoodLogEntry[]>([]);

  const handlePlanComplete = () => {
    const computedPlan = calculatePlan(profile);
    setPlan(computedPlan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setProfile(INITIAL_PROFILE);
    setPlan(null);
    setFoodLog([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddFood = (entry: FoodLogEntry) => {
    setFoodLog((prev) => [entry, ...prev]);
  };

  const handleRemoveFood = (id: string) => {
    setFoodLog((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearLog = () => {
    setFoodLog([]);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors py-6 sm:py-10 px-4 sm:px-6">
      <main className="max-w-[640px] mx-auto">
        {/* App Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F6B6B]/10 dark:bg-[#179696]/20 text-[#0F6B6B] dark:text-[#179696] mb-3">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest font-condensed">
              Mifflin-St Jeor Engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-condensed uppercase text-[var(--text-primary)] leading-tight">
            Athlete Fuel Planner
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1.5 max-w-md mx-auto">
            Calculate your basal metabolic target, fine-tune macronutrients, and log fuel to power performance.
          </p>
        </header>

        {/* Content Section: Stepper vs Results + FoodTracker */}
        {!plan ? (
          <Stepper
            profile={profile}
            onChange={setProfile}
            onComplete={handlePlanComplete}
          />
        ) : (
          <div className="space-y-8">
            <Results
              plan={plan}
              profile={profile}
              onReset={handleReset}
            />

            <FoodTracker
              plan={plan}
              log={foodLog}
              onAddFood={handleAddFood}
              onRemoveFood={handleRemoveFood}
              onClearLog={handleClearLog}
            />
          </div>
        )}

        {/* Minimal Footer */}
        <footer className="mt-12 mb-6 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-color)] pt-6">
          <p>
            Athlete Fuel Planner · Precision nutrition & macronutrient allocation for athletic performance.
          </p>
        </footer>
      </main>
    </div>
  );
}
