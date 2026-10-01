import React, { useState, useRef, useEffect } from 'react';
import { AthleteProfile, Sex, TrainingLevel, Goal } from '../types';
import { TRAINING_LEVEL_DETAILS, GOAL_DETAILS } from '../utils/calculator';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface StepperProps {
  profile: AthleteProfile;
  onChange: (profile: AthleteProfile) => void;
  onComplete: () => void;
}

export const Stepper: React.FC<StepperProps> = ({ profile, onChange, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when stepping into numeric steps
  useEffect(() => {
    if (currentStep >= 2 && currentStep <= 4) {
      inputRef.current?.focus();
    }
  }, [currentStep]);

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1:
        if (!profile.sex) {
          return 'Please select biological sex to calculate baseline BMR accurately.';
        }
        return null;
      case 2:
        if (profile.age === '' || isNaN(Number(profile.age))) {
          return 'Please enter your age.';
        }
        if (Number(profile.age) < 12 || Number(profile.age) > 90) {
          return 'Please enter an age between 12 and 90 years.';
        }
        return null;
      case 3:
        if (profile.height === '' || isNaN(Number(profile.height))) {
          return 'Please enter your height in centimeters.';
        }
        if (Number(profile.height) < 120 || Number(profile.height) > 230) {
          return 'Please enter a height between 120 and 230 cm.';
        }
        return null;
      case 4:
        if (profile.weight === '' || isNaN(Number(profile.weight))) {
          return 'Please enter your body weight in kilograms.';
        }
        if (Number(profile.weight) < 30 || Number(profile.weight) > 200) {
          return 'Please enter a weight between 30 and 200 kg.';
        }
        return null;
      case 5:
        if (!profile.trainingLevel) {
          return 'Please select your weekly training level.';
        }
        return null;
      case 6:
        if (!profile.goal) {
          return 'Please select your primary fitness or athletic goal.';
        }
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const selectSex = (sex: Sex) => {
    onChange({ ...profile, sex });
    setError(null);
  };

  const selectTraining = (trainingLevel: TrainingLevel) => {
    onChange({ ...profile, trainingLevel });
    setError(null);
  };

  const selectGoal = (goal: Goal) => {
    onChange({ ...profile, goal });
    setError(null);
  };

  return (
    <div className="w-full max-w-[640px] mx-auto">
      {/* 6-Segment Progress Bar */}
      <div className="mb-6" aria-label={`Step ${currentStep} of 6`}>
        <div className="flex justify-between items-center mb-2 px-1 text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
          <span>Question {currentStep} of 6</span>
          <span>{Math.round((currentStep / 6) * 100)}% Complete</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={6}>
          {[1, 2, 3, 4, 5, 6].map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            return (
              <div
                key={step}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  isCompleted
                    ? 'bg-[#0F6B6B] dark:bg-[#179696]'
                    : isCurrent
                    ? 'bg-[#0F6B6B] dark:bg-[#179696] ring-2 ring-[#0F6B6B]/30 dark:ring-[#179696]/40'
                    : 'bg-[#D3DCE2] dark:bg-[#2D3D45]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-sm transition-shadow"
        aria-live="polite"
      >
        {/* Step 1: Sex */}
        {currentStep === 1 && (
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] mb-1 font-condensed">
              Baseline Biology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-condensed text-[var(--text-primary)]">
              What is your biological sex?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Used for Mifflin-St Jeor metabolic baseline formula calculations.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                aria-pressed={profile.sex === 'male'}
                onClick={() => selectSex('male')}
                className={`py-6 px-4 rounded-xl border-2 text-center font-condensed text-xl font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#0F6B6B] focus-visible:outline-none flex flex-col items-center justify-center gap-2 ${
                  profile.sex === 'male'
                    ? 'border-[#0F6B6B] bg-[#0F6B6B]/10 dark:bg-[#179696]/20 text-[#0F6B6B] dark:text-[#179696] ring-1 ring-[#0F6B6B]'
                    : 'border-[var(--border-color)] hover:border-[#0F6B6B]/50 bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <span>Male</span>
                {profile.sex === 'male' && <Check className="w-5 h-5 text-[#0F6B6B] dark:text-[#179696]" />}
              </button>

              <button
                type="button"
                aria-pressed={profile.sex === 'female'}
                onClick={() => selectSex('female')}
                className={`py-6 px-4 rounded-xl border-2 text-center font-condensed text-xl font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#0F6B6B] focus-visible:outline-none flex flex-col items-center justify-center gap-2 ${
                  profile.sex === 'female'
                    ? 'border-[#0F6B6B] bg-[#0F6B6B]/10 dark:bg-[#179696]/20 text-[#0F6B6B] dark:text-[#179696] ring-1 ring-[#0F6B6B]'
                    : 'border-[var(--border-color)] hover:border-[#0F6B6B]/50 bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <span>Female</span>
                {profile.sex === 'female' && <Check className="w-5 h-5 text-[#0F6B6B] dark:text-[#179696]" />}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Age */}
        {currentStep === 2 && (
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] mb-1 font-condensed">
              Athlete Profile
            </span>
            <label htmlFor="age-input" className="block text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-condensed text-[var(--text-primary)]">
              What is your age?
            </label>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Accepted range is 12 to 90 years. Press Enter to proceed.
            </p>

            <div className="relative max-w-xs mx-auto sm:mx-0">
              <input
                id="age-input"
                ref={inputRef}
                type="number"
                min={12}
                max={90}
                placeholder="28"
                value={profile.age}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  onChange({ ...profile, age: val });
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                className="w-full text-3xl font-bold font-condensed px-4 py-3 bg-[var(--bg-subtle)] border-2 border-[var(--border-color)] focus:border-[#0F6B6B] dark:focus:border-[#179696] rounded-xl text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--text-muted)]">
                years
              </span>
            </div>
          </div>
        )}

        {/* Step 3: Height */}
        {currentStep === 3 && (
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] mb-1 font-condensed">
              Body Dimensions
            </span>
            <label htmlFor="height-input" className="block text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-condensed text-[var(--text-primary)]">
              What is your height?
            </label>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Enter your height in centimeters (120–230 cm). Press Enter to continue.
            </p>

            <div className="relative max-w-xs mx-auto sm:mx-0">
              <input
                id="height-input"
                ref={inputRef}
                type="number"
                min={120}
                max={230}
                placeholder="175"
                value={profile.height}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  onChange({ ...profile, height: val });
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                className="w-full text-3xl font-bold font-condensed px-4 py-3 bg-[var(--bg-subtle)] border-2 border-[var(--border-color)] focus:border-[#0F6B6B] dark:focus:border-[#179696] rounded-xl text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--text-muted)]">
                cm
              </span>
            </div>
          </div>
        )}

        {/* Step 4: Weight */}
        {currentStep === 4 && (
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] mb-1 font-condensed">
              Body Dimensions
            </span>
            <label htmlFor="weight-input" className="block text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-condensed text-[var(--text-primary)]">
              What is your body weight?
            </label>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Enter your weight in kilograms (30–200 kg). Used for target macro scaling. Press Enter to continue.
            </p>

            <div className="relative max-w-xs mx-auto sm:mx-0">
              <input
                id="weight-input"
                ref={inputRef}
                type="number"
                min={30}
                max={200}
                step="0.5"
                placeholder="75"
                value={profile.weight}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  onChange({ ...profile, weight: val });
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                className="w-full text-3xl font-bold font-condensed px-4 py-3 bg-[var(--bg-subtle)] border-2 border-[var(--border-color)] focus:border-[#0F6B6B] dark:focus:border-[#179696] rounded-xl text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B6B]/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--text-muted)]">
                kg
              </span>
            </div>
          </div>
        )}

        {/* Step 5: Training level */}
        {currentStep === 5 && (
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] mb-1 font-condensed">
              Energy Expenditure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-condensed text-[var(--text-primary)]">
              What is your training level?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              Select the option that best reflects your current weekly athletic routine.
            </p>

            <div className="space-y-3">
              {(Object.keys(TRAINING_LEVEL_DETAILS) as TrainingLevel[]).map((levelKey) => {
                const item = TRAINING_LEVEL_DETAILS[levelKey];
                const isSelected = profile.trainingLevel === levelKey;
                return (
                  <button
                    key={levelKey}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectTraining(levelKey)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-[#0F6B6B] focus-visible:outline-none flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#0F6B6B] bg-[#0F6B6B]/10 dark:bg-[#179696]/20 text-[var(--text-primary)] ring-1 ring-[#0F6B6B]'
                        : 'border-[var(--border-color)] hover:border-[#0F6B6B]/50 bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div>
                      <div className="font-condensed text-xl font-bold leading-tight">
                        {item.label}
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="shrink-0 w-6 h-6 rounded-full bg-[#0F6B6B] dark:bg-[#179696] text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Goal */}
        {currentStep === 6 && (
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#0F6B6B] dark:text-[#179696] mb-1 font-condensed">
              Target Directive
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-condensed text-[var(--text-primary)]">
              What is your primary goal?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              Adjusts your caloric budget and assigns target protein ratios.
            </p>

            <div className="space-y-3">
              {(Object.keys(GOAL_DETAILS) as Goal[]).map((goalKey) => {
                const item = GOAL_DETAILS[goalKey];
                const isSelected = profile.goal === goalKey;
                return (
                  <button
                    key={goalKey}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectGoal(goalKey)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-[#0F6B6B] focus-visible:outline-none flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#0F6B6B] bg-[#0F6B6B]/10 dark:bg-[#179696]/20 text-[var(--text-primary)] ring-1 ring-[#0F6B6B]'
                        : 'border-[var(--border-color)] hover:border-[#0F6B6B]/50 bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div>
                      <div className="font-condensed text-xl font-bold leading-tight">
                        {item.label}
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="shrink-0 w-6 h-6 rounded-full bg-[#0F6B6B] dark:bg-[#179696] text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Inline Error Message */}
        {error && (
          <div
            role="alert"
            className="mt-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-sm font-medium flex items-center gap-2"
          >
            <span className="font-bold font-condensed tracking-wide uppercase text-xs px-1.5 py-0.5 rounded bg-red-500/20">
              Notice
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls: Back and Next */}
        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-3 px-5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] font-condensed font-bold text-base transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#0F6B6B] focus-visible:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="ml-auto py-3 px-6 rounded-xl bg-[#0F6B6B] hover:bg-[#0C5555] dark:bg-[#179696] dark:hover:bg-[#1EBABA] text-white font-condensed font-bold text-lg tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#0F6B6B] focus-visible:outline-none"
          >
            <span>{currentStep === 6 ? 'Show my plan' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
