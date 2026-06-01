"use client";

import { PageHeader } from "../components/PageHeader";
import { useState } from "react";
import { vaccineDatabase, VaccineKey, VACCINE_GLOBAL_DISCLAIMER } from "@/lib/vaccineData";

export default function VaccineHubPage() {
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineKey | "">("");
  const [initialDate, setInitialDate] = useState<string>("");

  const vaccine = selectedVaccine ? vaccineDatabase[selectedVaccine] : null;

  // Safely converts tracking week offsets into an absolute calendar string representation
  const calculateMilestoneDate = (weeksOffset: number) => {
    if (!initialDate) return null;

    const reference = new Date(initialDate);
    if (isNaN(reference.getTime())) return null; // Edge-case syntax protection fallback

    const targetDate = new Date(reference.getTime());
    targetDate.setDate(targetDate.getDate() + weeksOffset * 7);

    return targetDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <PageHeader
        title="Vaccine Hub"
        subtitle="Immunization Tracker"
        backHref="/"
        variant="light"
      />
<div className="min-h-screen bg-(--color-surface-muted) text-(--color-text-primary) p-6 md:p-10 transition-colors duration-200">      
    {/* HEADER */}
<div className="max-w-5xl mx-auto mb-8 border-b border-(--color-border-muted) pb-5">        
<h1 className="text-3xl font-extrabold text-emerald-600 tracking-tight flex items-center gap-2">
            <span>💉</span> Vaccine Hub & Immunization Tracker
          </h1>
<p className="text-sm text-(--color-text-secondary) mt-2 max-w-2xl">
            Explore vaccine schedules, safety information, and aftercare guidance for better public health awareness.
          </p>
        </div>

        {/* CONTROLS AREA (Dropdown + Optional Dynamic Date Tracker Grid) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* SELECT DROPDOWN */}
          <div>
            <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
              Select Disease / Vaccine
            </label>
            <select
className="w-full p-3 border border-(--color-border-muted) rounded-lg bg-(--color-surface-page) shadow-sm font-medium text-(--color-text-primary) outline-none focus:ring-2 focus:ring-emerald-500"
value={selectedVaccine}
              onChange={(e) => {
                setSelectedVaccine(e.target.value as VaccineKey);
                setInitialDate(""); // Clear date tracking context when swapping vaccine targets
              }}
            >
              <option value="">🔎 Choose a Vaccine Profile...</option>
              {(Object.keys(vaccineDatabase) as VaccineKey[]).map((key) => (
                <option key={key} value={key}>
                  {vaccineDatabase[key].disease_name}
                </option>
              ))}
            </select>
          </div>

          {/* TIME GENERATOR CONTROL */}
          {vaccine && (
            <div>
              <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                {vaccine.is_relative_to_birth ? "Child's Birth Date" : "First Dose Milestone Base Date"}
              </label>
              <input
                type="date"
className="w-full p-3 border border-(--color-border-muted) rounded-lg bg-(--color-surface-page) shadow-sm font-medium text-(--color-text-primary) outline-none focus:ring-2 focus:ring-emerald-500"
                value={initialDate}
                onChange={(e) => setInitialDate(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {!vaccine && (
<div className="max-w-5xl mx-auto bg-(--color-surface-page) p-10 rounded-xl shadow-sm text-center border border-(--color-border-muted)">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mb-3">
              📅
            </div>
            <p className="text-lg font-semibold text-(--color-text-primary)">No vaccine selected</p>
            <p className="text-sm text-(--color-text-secondary) mt-1">Choose a vaccine above to unlock tracking tools:</p>
            <ul className="mt-4 max-w-sm mx-auto space-y-2.5 rounded-lg border border-(--color-border-muted) bg-slate-50 p-4 text-left text-sm text-(--color-text-secondary) dark:text-blue-900">
              <li className="flex items-center gap-2"><span>📅</span> Dynamic projected immunization schedule</li>
              <li className="flex items-center gap-2"><span>⚠️</span> Side effects split parameters (mild vs severe)</li>
              <li className="flex items-center gap-2"><span>🩹</span> Clinical step-by-step aftercare instructions</li>
            </ul>
          </div>
        )}

        {/* MAIN CONTENT CANVAS */}
        {vaccine && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN: VACCINE DETAILS METADATA */}
            <div className="bg-(--color-surface-page) p-6 rounded-xl shadow-sm border border-(--color-border-muted) flex flex-col justify-between h-fit lg:sticky lg:top-6">
              <div>
                <h2 className="text-2xl font-bold text-(--color-text-primary) tracking-tight">{vaccine.disease_name}</h2>
                <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md mt-2 border border-emerald-100">
                  {vaccine.vaccine_name}
                </span>
                
                <div className="mt-5 text-sm text-(--color-text-secondary) space-y-3 border-t pt-4 border-(--color-border-muted)">
                  <p><b className="text-(--color-text-primary) font-semibold">Target Groups:</b> {vaccine.target_groups.join(", ")}</p>
                  <p><b className="text-(--color-text-primary) font-semibold">Total Doses:</b> {vaccine.total_doses}</p>
                  <p><b className="text-(--color-text-primary) font-semibold">Effectiveness:</b> {vaccine.effectiveness}</p>
                  <p><b className="text-(--color-text-primary) font-semibold">Classification:</b> {vaccine.category}</p>
                </div>
              </div>

              <div className="mt-6 text-xs text-(--color-text-secondary) border-t pt-4 border-(--color-border-muted) leading-relaxed bg-slate-50 p-3 rounded-lg border border-(--color-border-muted)">
                <span className="font-bold text-(--color-text-secondary) dark:text-gray-900 block mb-1 not-italic">
  About Disease:
</span>
<span className="italic dark:text-gray-900">
  {vaccine.disease_summary}
</span>
              </div>
            </div>

            {/* MIDDLE & RIGHT COMBINED COLUMN: TIMELINE, SYMPTOMS & SAFETY INSIGHTS */}
            <div className="lg:col-span-2 space-y-6">

              <h3 className="font-bold text-(--color-text-primary) flex items-center gap-1.5 text-lg">
                <span>📅</span> Immunization Schedule Layout
              </h3>

              {/* GENERATED DOSES RENDER LOOP */}
              <div className="space-y-3">
                {(vaccine.dosing_intervals_weeks || []).map((weeks, index) => {
                  const dateString = calculateMilestoneDate(weeks);
                  
                  let labelHeader = "";
                  if (vaccine.is_relative_to_birth) {
                    labelHeader = weeks === 0 ? "At Birth Administration" : `At ${weeks} Weeks of Age`;
                  } else {
                    labelHeader = index === 0 ? "Initial Administration (Baseline)" : `Dose Step ${index + 1} (+${weeks} weeks later)`;
                  }

                  return (
                    <div
                      key={index}
className="flex items-center gap-4 p-4 bg-(--color-surface-page) border border-(--color-border-muted) rounded-xl transition-colors"                    >
                      <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-800 shrink-0">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-(--color-text-primary) text-sm sm:text-base">
                          {labelHeader}
                        </p>
                        <p className={`text-xs sm:text-sm mt-0.5 ${dateString ? "text-emerald-700 font-semibold" : "text-amber-700 font-medium bg-amber-50/50 px-2 py-0.5 rounded inline-block mt-1 border border-amber-100/50"}`}>
                          {dateString ? `🎯 Target Execution Date: ${dateString}` : "⚠️ Select a date above to project scheduled timelines"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SIDE EFFECTS CONDITIONAL ARRAYS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                  <h4 className="font-bold text-amber-800 flex items-center gap-1.5 text-sm uppercase tracking-wide">
                    <span>🟢</span> Common Post-Effects
                  </h4>
                  <ul className="list-disc ml-5 text-xs sm:text-sm mt-2.5 text-amber-950 space-y-1.5 font-medium">
                    {vaccine.side_effects.common.map((effect, index) => (
                      <li key={index}>{effect}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200/60">
                  <h4 className="font-bold text-rose-800 flex items-center gap-1.5 text-sm uppercase tracking-wide">
                    <span>🛑</span> Severe Reactions
                  </h4>
                  <ul className="list-disc ml-5 text-xs sm:text-sm mt-2.5 text-rose-950 space-y-1.5 font-medium">
                    {vaccine.side_effects.severe.map((effect, index) => (
                      <li key={index}>{effect}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AFTERCARE DATA FRAME */}
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200/60">
                <h4 className="font-bold text-sky-800 flex items-center gap-1.5 text-sm uppercase tracking-wide">
                  <span>🩹</span> Immediate Aftercare Guidance
                </h4>
                <p className="text-xs sm:text-sm mt-2 text-sky-950 font-medium leading-relaxed">
                  {vaccine.aftercare_text}
                </p>
              </div>

              {/* SYSTEM LEGAL DISCLAIMER FOOTER COMPONENT */}
              <p className="text-[11px] text-(--color-text-secondary) mt-6 text-center border-t pt-4 border-(--color-border-muted) italic leading-normal block">
                {VACCINE_GLOBAL_DISCLAIMER}
              </p>

            </div>
          </div>
        )}
      </div>
    </>
  );
}