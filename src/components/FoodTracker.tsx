import React, { useState } from 'react';
import { PlanResults, FoodLogEntry } from '../types';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { Plus, Trash2, X, UtensilsCrossed } from 'lucide-react';

interface FoodTrackerProps {
  plan: PlanResults;
  log: FoodLogEntry[];
  onAddFood: (entry: FoodLogEntry) => void;
  onRemoveFood: (id: string) => void;
  onClearLog: () => void;
}

export const FoodTracker: React.FC<FoodTrackerProps> = ({
  plan,
  log,
  onAddFood,
  onRemoveFood,
  onClearLog,
}) => {
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('');
  const [foodName, setFoodName] = useState<string>('');
  const [servings, setServings] = useState<number | ''>(1);
  const [protein, setProtein] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [calories, setCalories] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  // Totals from log
  const totals = log.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedDropdownValue(val);
    setError(null);

    if (!val) {
      return;
    }

    // Find the item in FOOD_DATABASE
    for (const group of FOOD_DATABASE) {
      const match = group.items.find((item) => item.name === val);
      if (match) {
        setFoodName(match.name);
        setProtein(match.protein);
        setCarbs(match.carbs);
        setFat(match.fat);
        setCalories(match.calories);
        setServings(1);
        break;
      }
    }
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName.trim()) {
      setError('Please enter or select a food name.');
      return;
    }

    if (servings === '' || Number(servings) <= 0) {
      setError('Please enter a valid servings count greater than 0.');
      return;
    }

    const p = protein === '' ? 0 : Number(protein);
    const c = carbs === '' ? 0 : Number(carbs);
    const f = fat === '' ? 0 : Number(fat);

    if (isNaN(p) || p < 0 || isNaN(c) || c < 0 || isNaN(f) || f < 0) {
      setError('Please enter valid positive numbers for protein, carbs, and fat.');
      return;
    }

    if (p === 0 && c === 0 && f === 0 && (calories === '' || Number(calories) <= 0)) {
      setError('Please enter nutrition values for this food.');
      return;
    }

    const servingsFactor = Number(servings);

    // If calories is blank, calculate: protein*4 + carbs*4 + fat*9
    let singleServingCalories: number;
    if (calories !== '' && !isNaN(Number(calories))) {
      singleServingCalories = Number(calories);
    } else {
      singleServingCalories = p * 4 + c * 4 + f * 9;
    }

    const entryCalories = Math.round(singleServingCalories * servingsFactor);
    const entryProtein = Math.round(p * servingsFactor * 10) / 10;
    const entryCarbs = Math.round(c * servingsFactor * 10) / 10;
    const entryFat = Math.round(f * servingsFactor * 10) / 10;

    const newEntry: FoodLogEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}-${Math.random()}`,
      name: foodName.trim(),
      servings: servingsFactor,
      calories: entryCalories,
      protein: entryProtein,
      carbs: entryCarbs,
      fat: entryFat,
      timestamp: Date.now(),
    };

    onAddFood(newEntry);

    // Reset form
    setFoodName('');
    setServings(1);
    setProtein('');
    setCarbs('');
    setFat('');
    setCalories('');
    setSelectedDropdownValue('');
    setError(null);
  };

  // Helper for meter details
  const renderMeter = (
    label: string,
    current: number,
    target: number,
    unit: string,
    accentClass: string,
    meterId: string
  ) => {
    const diff = target - current;
    const isOver = diff < 0;
    const absDiff = Math.abs(Math.round(diff * 10) / 10);
    const formattedCurrent = Math.round(current * 10) / 10;
    const percentage = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;

    const statusText = isOver
      ? `${formattedCurrent} / ${target} ${unit} · ${absDiff} over`
      : `${formattedCurrent} / ${target} ${unit} · ${absDiff} left`;

    return (
      <div className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-4">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="font-condensed font-bold text-base uppercase tracking-wider text-[var(--text-primary)]">
            {label}
          </span>
          <span
            className={`text-xs font-semibold ${
              isOver ? 'text-red-600 dark:text-red-400 font-bold' : 'text-[var(--text-secondary)]'
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-3 rounded-full bg-[var(--border-color)] overflow-hidden"
          role="progressbar"
          id={meterId}
          aria-valuenow={formattedCurrent}
          aria-valuemin={0}
          aria-valuemax={target}
          aria-label={`${label} progress: ${statusText}`}
        >
          <div
            style={{ width: `${percentage}%` }}
            className={`h-full transition-all duration-300 rounded-full ${
              isOver ? 'bg-red-600 dark:bg-red-500' : accentClass
            }`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[640px] mx-auto space-y-6 pt-2">
      {/* Tracker Card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-6">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] font-condensed">
              Daily Intake Log
            </span>
            <h2 className="text-2xl font-bold font-condensed tracking-tight text-[var(--text-primary)]">
              Track what you eat
            </h2>
          </div>
          {log.length > 0 && (
            <button
              type="button"
              onClick={onClearLog}
              className="py-2 px-3.5 rounded-lg border border-[var(--border-color)] hover:bg-red-500/10 hover:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
              aria-label="Clear all foods from today's log"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear log</span>
            </button>
          )}
        </div>

        {/* 4 Progress Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {renderMeter('Calories', totals.calories, plan.targetCalories, 'kcal', 'bg-[#0F6B6B] dark:bg-[#179696]', 'meter-cal')}
          {renderMeter('Protein', totals.protein, plan.proteinG, 'g', 'bg-[#0F6B6B] dark:bg-[#179696]', 'meter-protein')}
          {renderMeter('Carbs', totals.carbs, plan.carbsG, 'g', 'bg-[#F2A900]', 'meter-carbs')}
          {renderMeter('Fat', totals.fat, plan.fatG, 'g', 'bg-[#8A5CF5]', 'meter-fat')}
        </div>

        {/* Add Food Form */}
        <form onSubmit={handleAddFood} className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-5 mb-8">
          <div className="font-condensed font-bold text-lg text-[var(--text-primary)] mb-3">
            Add Food or Meal
          </div>

          {/* Grouped Select Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="food-quick-select"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
            >
              Indian and common foods (per serving, approximate; kcal shown)
            </label>
            <select
              id="food-quick-select"
              value={selectedDropdownValue}
              onChange={handleDropdownSelect}
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[#0F6B6B] dark:focus:border-[#179696] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/20"
            >
              <option value="">-- Choose from food database or enter custom food below --</option>
              {FOOD_DATABASE.map((category) => (
                <optgroup key={category.category} label={category.category}>
                  {category.items.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} — {item.calories} kcal (P: {item.protein}g, C: {item.carbs}g, F: {item.fat}g)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Food Name & Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-2">
              <label htmlFor="food-name" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Food Name
              </label>
              <input
                id="food-name"
                type="text"
                placeholder="e.g. Masala dosa or Chicken breast"
                value={foodName}
                onChange={(e) => {
                  setFoodName(e.target.value);
                  setError(null);
                }}
                className="w-full text-sm px-3.5 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[#0F6B6B] dark:focus:border-[#179696] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/20"
              />
            </div>

            <div>
              <label htmlFor="food-servings" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Servings
              </label>
              <input
                id="food-servings"
                type="number"
                min="0.1"
                step="0.1"
                value={servings}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setServings(val);
                  setError(null);
                }}
                className="w-full text-sm px-3.5 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[#0F6B6B] dark:focus:border-[#179696] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/20"
              />
            </div>
          </div>

          {/* Macros & Optional Calories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label htmlFor="food-protein" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Protein (g)
              </label>
              <input
                id="food-protein"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={protein}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setProtein(val);
                  setError(null);
                }}
                className="w-full text-sm px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[#0F6B6B] dark:focus:border-[#179696] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/20"
              />
            </div>

            <div>
              <label htmlFor="food-carbs" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Carbs (g)
              </label>
              <input
                id="food-carbs"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={carbs}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setCarbs(val);
                  setError(null);
                }}
                className="w-full text-sm px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[#0F6B6B] dark:focus:border-[#179696] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/20"
              />
            </div>

            <div>
              <label htmlFor="food-fat" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Fat (g)
              </label>
              <input
                id="food-fat"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={fat}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setFat(val);
                  setError(null);
                }}
                className="w-full text-sm px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[#0F6B6B] dark:focus:border-[#179696] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/20"
              />
            </div>

            <div>
              <label htmlFor="food-calories" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Calories (kcal) <span className="text-[10px] text-[var(--text-muted)] font-normal">opt.</span>
              </label>
              <input
                id="food-calories"
                type="number"
                min="0"
                placeholder="Auto (P*4+C*4+F*9)"
                value={calories}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setCalories(val);
                  setError(null);
                }}
                className="w-full text-sm px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[#0F6B6B] dark:focus:border-[#179696] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/20"
              />
            </div>
          </div>

          {/* Form Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-medium"
            >
              {error}
            </div>
          )}

          {/* Add Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto py-2.5 px-6 rounded-lg bg-[#0F6B6B] hover:bg-[#0C5555] dark:bg-[#179696] dark:hover:bg-[#1EBABA] text-white font-condensed font-bold text-base tracking-wide flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#0F6B6B] focus-visible:outline-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add food</span>
            </button>
          </div>
        </form>

        {/* Log List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-condensed font-bold text-lg text-[var(--text-primary)]">
              Logged Foods ({log.length})
            </h3>
            {log.length > 0 && (
              <span className="text-xs text-[var(--text-muted)]">
                Total: {Math.round(totals.calories)} kcal
              </span>
            )}
          </div>

          {log.length === 0 ? (
            /* Empty State */
            <div className="py-10 px-4 text-center border-2 border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-subtle)]">
              <UtensilsCrossed className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2 opacity-60" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                No foods logged yet.
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Choose an item from the dropdown above or enter your own custom meal.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {log.map((item) => {
                const servingsLabel = item.servings !== 1 ? ` × ${item.servings}` : '';
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between gap-3 hover:border-[#0F6B6B]/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-condensed font-bold text-base text-[var(--text-primary)] truncate">
                        {item.name}
                        {servingsLabel && (
                          <span className="text-xs font-normal text-[var(--text-muted)] ml-1 font-body">
                            {servingsLabel}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5 flex flex-wrap gap-x-2">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {item.calories} kcal
                        </span>
                        <span className="text-[var(--text-muted)]">·</span>
                        <span>P: {item.protein}g</span>
                        <span className="text-[var(--text-muted)]">·</span>
                        <span>C: {item.carbs}g</span>
                        <span className="text-[var(--text-muted)]">·</span>
                        <span>F: {item.fat}g</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveFood(item.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                      aria-label={`Remove ${item.name} from log`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
