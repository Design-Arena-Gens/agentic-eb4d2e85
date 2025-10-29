"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type ScaleOption = 1 | 2 | 3 | 4 | 5;

type FormData = {
  fullName: string;
  email: string;
  academicLevel: string;
  fieldOfStudy: string;
  frequency: string;
  aiTools: string[];
  otherTool: string;
  useCases: string[];
  hoursPerWeek: string;
  impact: ScaleOption | "";
  confidence: ScaleOption | "";
  concerns: string[];
  campusSupport: string;
  biggestBenefit: string;
};

const defaultFormData: FormData = {
  fullName: "",
  email: "",
  academicLevel: "",
  fieldOfStudy: "",
  frequency: "",
  aiTools: [],
  otherTool: "",
  useCases: [],
  hoursPerWeek: "",
  impact: "",
  confidence: "",
  concerns: [],
  campusSupport: "",
  biggestBenefit: "",
};

const requiredFields: Array<keyof FormData> = [
  "fullName",
  "email",
  "academicLevel",
  "frequency",
  "aiTools",
  "useCases",
  "impact",
  "confidence",
];

const aiToolOptions = [
  "ChatGPT or similar chatbots",
  "Google Gemini/Bard",
  "Microsoft Copilot",
  "Claude",
  "Notion AI",
  "AI features built into course platforms",
];

const useCaseOptions = [
  "Brainstorming and ideation",
  "Drafting written assignments",
  "Explaining difficult concepts",
  "Coding or debugging",
  "Research and summarization",
  "Language translation or practice",
];

const concernOptions = [
  "Accuracy or hallucinations",
  "Academic integrity rules",
  "Privacy of my prompts",
  "Bias in responses",
  "Over-reliance on automation",
  "Cost of paid plans",
];

const academicLevels = [
  "High school",
  "Undergraduate (associate)",
  "Undergraduate (bachelor's)",
  "Graduate",
  "Doctoral",
  "Continuing education / bootcamp",
];

const frequencyOptions = [
  "Several times a day",
  "Daily",
  "A few times a week",
  "Occasionally",
  "Rarely",
  "Never",
];

const scaleLabels: Record<ScaleOption, string> = {
  1: "Very low",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Very high",
};

const scaleOptions: ScaleOption[] = [1, 2, 3, 4, 5];

export default function Home() {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);

  const completion = useMemo(() => {
    const answered = requiredFields.reduce((total, field) => {
      if (field === "aiTools") {
        return formData.aiTools.length > 0 || formData.otherTool.trim()
          ? total + 1
          : total;
      }

      const value = formData[field];
      if (Array.isArray(value)) {
        return value.length > 0 ? total + 1 : total;
      }
      return value ? total + 1 : total;
    }, 0);

    return Math.round((answered / requiredFields.length) * 100);
  }, [formData]);

  const handleInputChange = (field: keyof FormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    };

  const handleTextAreaChange = (field: keyof FormData) =>
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const toggleCheckbox = (
    field: "aiTools" | "useCases" | "concerns",
    option: string,
  ) => {
    setFormData((prev) => {
      const current = prev[field];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return {
        ...prev,
        [field]: next,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validate = (data: FormData) => {
    const validationErrors: Partial<Record<keyof FormData, string>> = {};

    if (!data.fullName.trim()) {
      validationErrors.fullName = "Please enter your preferred name.";
    }

    if (!data.email.trim()) {
      validationErrors.email = "An academic email helps us group responses.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      validationErrors.email = "Enter a valid email address.";
    }

    if (!data.academicLevel) {
      validationErrors.academicLevel = "Select your current academic level.";
    }

    if (!data.frequency) {
      validationErrors.frequency = "How often do you engage with AI tools?";
    }

    if (data.aiTools.length === 0 && !data.otherTool.trim()) {
      validationErrors.aiTools = "Pick at least one tool or describe another.";
    }

    if (data.useCases.length === 0) {
      validationErrors.useCases = "Choose the scenarios where you rely on AI.";
    }

    if (!data.impact) {
      validationErrors.impact = "Rate the academic impact of AI for you.";
    }

    if (!data.confidence) {
      validationErrors.confidence = "Tell us how confident you feel using AI.";
    }

    return validationErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmittedData(null);
      return;
    }

    setSubmittedData(formData);
    setSubmittedAt(new Date());
    setErrors({});
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setErrors({});
    setSubmittedData(null);
    setSubmittedAt(null);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f4] py-12">
      <div className="mx-auto mb-6 max-w-3xl rounded-t-2xl border border-[#dadce0] bg-white shadow-sm">
        <div className="relative overflow-hidden rounded-t-2xl pb-8 pt-10">
          <div className="absolute inset-0 h-12 bg-gradient-to-r from-[#5f36ff] via-[#9333ea] to-[#c084fc]" />
          <div className="relative px-8 pt-16">
            <h1 className="text-3xl font-semibold text-[#3c4043]">
              Student AI Usage Pulse Survey
            </h1>
            <p className="mt-2 max-w-2xl text-base text-[#5f6368]">
              This short survey captures how students incorporate generative AI
              into their learning. Individual responses remain confidential and
              will guide campus support initiatives.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-[#3c4043]">
              <div className="h-2 w-full rounded-full bg-[#e8eaed]">
                <div
                  className="h-full rounded-full bg-[#5f36ff] transition-all"
                  style={{ width: `${Math.max(completion, 6)}%` }}
                />
              </div>
              <span className="min-w-[3rem] text-right font-medium">
                {completion}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#dadce0] bg-white p-8 shadow-sm"
        >
          <section className="space-y-4">
            <header>
              <h2 className="text-xl font-semibold text-[#3c4043]">
                Student Profile
              </h2>
              <p className="text-sm text-[#5f6368]">
                Tell us a little about yourself to help us contextualize AI
                adoption on campus.
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#3c4043]" htmlFor="fullName">
                  Preferred name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm text-[#202124] outline-none focus:border-[#5f36ff] focus:bg-white focus:ring-2 focus:ring-[#c084fc]/40"
                  value={formData.fullName}
                  onChange={handleInputChange("fullName")}
                  placeholder="Alex Rivera"
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-[#d93025]">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#3c4043]" htmlFor="email">
                  Academic email *
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm text-[#202124] outline-none focus:border-[#5f36ff] focus:bg-white focus:ring-2 focus:ring-[#c084fc]/40"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  placeholder="name@school.edu"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#d93025]">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="text-sm font-medium text-[#3c4043]"
                  htmlFor="academicLevel"
                >
                  Academic level *
                </label>
                <select
                  id="academicLevel"
                  className="mt-1 w-full rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm text-[#202124] outline-none focus:border-[#5f36ff] focus:bg-white focus:ring-2 focus:ring-[#c084fc]/40"
                  value={formData.academicLevel}
                  onChange={handleInputChange("academicLevel")}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {academicLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.academicLevel && (
                  <p className="mt-1 text-xs text-[#d93025]">
                    {errors.academicLevel}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#3c4043]" htmlFor="fieldOfStudy">
                  Major, program, or focus area
                </label>
                <input
                  id="fieldOfStudy"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm text-[#202124] outline-none focus:border-[#5f36ff] focus:bg-white focus:ring-2 focus:ring-[#c084fc]/40"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange("fieldOfStudy")}
                  placeholder="e.g., Data Science"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <header>
              <h2 className="text-xl font-semibold text-[#3c4043]">
                Engagement with AI tools
              </h2>
            </header>

            <div>
              <p className="text-sm font-medium text-[#3c4043]">
                How frequently do you use AI tools for academic or personal
                learning? *
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {frequencyOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition shadow-sm ${
                      formData.frequency === option
                        ? "border-[#5f36ff] bg-[#ede7ff]"
                        : "border-[#dadce0] bg-white hover:border-[#5f36ff]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option}
                      className="h-4 w-4 accent-[#5f36ff]"
                      checked={formData.frequency === option}
                      onChange={handleInputChange("frequency")}
                    />
                    <span className="text-[#3c4043]">{option}</span>
                  </label>
                ))}
              </div>
              {errors.frequency && (
                <p className="mt-1 text-xs text-[#d93025]">{errors.frequency}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-[#3c4043]">
                Which AI tools do you rely on most often? *
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {aiToolOptions.map((option) => {
                  const checked = formData.aiTools.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition shadow-sm ${
                        checked
                          ? "border-[#5f36ff] bg-[#ede7ff]"
                          : "border-[#dadce0] bg-white hover:border-[#5f36ff]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-[#5f36ff]"
                        checked={checked}
                        onChange={() => toggleCheckbox("aiTools", option)}
                      />
                      <span className="text-[#3c4043]">{option}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-3">
                <label
                  className="text-xs uppercase tracking-wide text-[#5f6368]"
                  htmlFor="otherTool"
                >
                  Other tool(s)
                </label>
                <input
                  id="otherTool"
                  type="text"
                  value={formData.otherTool}
                  onChange={handleInputChange("otherTool")}
                  placeholder="Add additional tools"
                  className="mt-1 w-full rounded-lg border border-dashed border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm outline-none focus:border-[#5f36ff] focus:bg-white focus:ring-2 focus:ring-[#c084fc]/40"
                />
              </div>
              {errors.aiTools && (
                <p className="mt-1 text-xs text-[#d93025]">{errors.aiTools}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-[#3c4043]">
                What do you use AI for most frequently? *
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {useCaseOptions.map((option) => {
                  const checked = formData.useCases.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition shadow-sm ${
                        checked
                          ? "border-[#5f36ff] bg-[#ede7ff]"
                          : "border-[#dadce0] bg-white hover:border-[#5f36ff]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-[#5f36ff]"
                        checked={checked}
                        onChange={() => toggleCheckbox("useCases", option)}
                      />
                      <span className="text-[#3c4043]">{option}</span>
                    </label>
                  );
                })}
              </div>
              {errors.useCases && (
                <p className="mt-1 text-xs text-[#d93025]">{errors.useCases}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#3c4043]" htmlFor="hoursPerWeek">
                  Approximate hours per week with AI
                </label>
                <input
                  id="hoursPerWeek"
                  type="number"
                  min="0"
                  max="168"
                  value={formData.hoursPerWeek}
                  onChange={handleInputChange("hoursPerWeek")}
                  placeholder="e.g., 5"
                  className="mt-1 w-full rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm text-[#202124] outline-none focus:border-[#5f36ff] focus:bg-white focus:ring-2 focus:ring-[#c084fc]/40"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <header>
              <h2 className="text-xl font-semibold text-[#3c4043]">
                Perception and support
              </h2>
            </header>

            <div className="space-y-3">
              <p className="text-sm font-medium text-[#3c4043]">
                How much has AI improved your academic outcomes? *
              </p>
              <div className="grid gap-3 sm:grid-cols-5">
                {scaleOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer flex-col items-center rounded-xl border px-4 py-3 text-sm transition shadow-sm ${
                      formData.impact === option
                        ? "border-[#5f36ff] bg-[#ede7ff]"
                        : "border-[#dadce0] bg-white hover:border-[#5f36ff]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="impact"
                      value={option}
                      className="h-4 w-4 accent-[#5f36ff]"
                      checked={formData.impact === option}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          impact: Number(event.target.value) as ScaleOption,
                        }))
                      }
                    />
                    <span className="mt-2 text-xs font-medium text-[#3c4043]">
                      {scaleLabels[option]}
                    </span>
                  </label>
                ))}
              </div>
              {errors.impact && (
                <p className="text-xs text-[#d93025]">{errors.impact}</p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-[#3c4043]">
                How confident do you feel evaluating AI-generated output? *
              </p>
              <div className="grid gap-3 sm:grid-cols-5">
                {scaleOptions.map((option) => (
                  <label
                    key={`confidence-${option}`}
                    className={`flex cursor-pointer flex-col items-center rounded-xl border px-4 py-3 text-sm transition shadow-sm ${
                      formData.confidence === option
                        ? "border-[#5f36ff] bg-[#ede7ff]"
                        : "border-[#dadce0] bg-white hover:border-[#5f36ff]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="confidence"
                      value={option}
                      className="h-4 w-4 accent-[#5f36ff]"
                      checked={formData.confidence === option}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          confidence: Number(event.target.value) as ScaleOption,
                        }))
                      }
                    />
                    <span className="mt-2 text-xs font-medium text-[#3c4043]">
                      {scaleLabels[option]}
                    </span>
                  </label>
                ))}
              </div>
              {errors.confidence && (
                <p className="text-xs text-[#d93025]">{errors.confidence}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-[#3c4043]">
                What concerns, if any, keep you from using AI more often?
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {concernOptions.map((option) => {
                  const checked = formData.concerns.includes(option);
                  return (
                    <label
                      key={`concern-${option}`}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition shadow-sm ${
                        checked
                          ? "border-[#5f36ff] bg-[#ede7ff]"
                          : "border-[#dadce0] bg-white hover:border-[#5f36ff]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-[#5f36ff]"
                        checked={checked}
                        onChange={() => toggleCheckbox("concerns", option)}
                      />
                      <span className="text-[#3c4043]">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label
                  className="text-sm font-medium text-[#3c4043]"
                  htmlFor="campusSupport"
                >
                  What campus resources or guidelines would help you use AI
                  responsibly?
                </label>
                <textarea
                  id="campusSupport"
                  rows={3}
                  value={formData.campusSupport}
                  onChange={handleTextAreaChange("campusSupport")}
                  placeholder="Workshops, sample policies, faculty training..."
                  className="mt-1 w-full rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm text-[#202124] outline-none focus:border-[#5f36ff] focus:bg-white focus:ring-2 focus:ring-[#c084fc]/40"
                />
              </div>

              <div>
                <label
                  className="text-sm font-medium text-[#3c4043]"
                  htmlFor="biggestBenefit"
                >
                  Describe the biggest benefit you&apos;ve experienced from using AI.
                </label>
                <textarea
                  id="biggestBenefit"
                  rows={3}
                  value={formData.biggestBenefit}
                  onChange={handleTextAreaChange("biggestBenefit")}
                  placeholder="Tell us a quick story or result."
                  className="mt-1 w-full rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm text-[#202124] outline-none focus:border-[#5f36ff] focus:bg-white focus:ring-2 focus:ring-[#c084fc]/40"
                />
              </div>
            </div>
          </section>

          <footer className="flex flex-col gap-3 border-t border-[#dadce0] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5f36ff] via-[#7c3aed] to-[#c084fc] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c084fc]/70"
              >
                Submit response
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-full border border-[#dadce0] px-6 py-2 text-sm font-semibold text-[#3c4043] transition hover:bg-[#f8f9fa]"
              >
                Clear form
              </button>
            </div>

            <p className="text-xs text-[#5f6368]">
              * Required questions — estimated completion time: 5 minutes
            </p>
          </footer>
        </form>

        {submittedData && (
          <aside className="space-y-4 rounded-2xl border border-[#dadce0] bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-[#1a73e8]">
                Response captured
              </h3>
              {submittedAt && (
                <p className="text-xs uppercase tracking-wide text-[#5f6368]">
                  Submitted {submittedAt.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-[#3c4043]">
                Copy the summary below to share or paste into a Google Doc for
                record keeping. You can continue refining your answers above.
              </p>
            </div>

            <dl className="grid gap-3 text-sm text-[#3c4043]">
              <div>
                <dt className="font-medium">Name</dt>
                <dd>{submittedData.fullName}</dd>
              </div>
              <div>
                <dt className="font-medium">Email</dt>
                <dd>{submittedData.email}</dd>
              </div>
              <div>
                <dt className="font-medium">Academic Level</dt>
                <dd>{submittedData.academicLevel}</dd>
              </div>
              {submittedData.fieldOfStudy && (
                <div>
                  <dt className="font-medium">Field of Study</dt>
                  <dd>{submittedData.fieldOfStudy}</dd>
                </div>
              )}
              <div>
                <dt className="font-medium">AI usage frequency</dt>
                <dd>{submittedData.frequency}</dd>
              </div>
              <div>
                <dt className="font-medium">Primary tools</dt>
                <dd>
                  {[...submittedData.aiTools, submittedData.otherTool]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Use cases</dt>
                <dd>{submittedData.useCases.join(", ")}</dd>
              </div>
              {submittedData.hoursPerWeek && (
                <div>
                  <dt className="font-medium">Hours per week</dt>
                  <dd>{submittedData.hoursPerWeek}</dd>
                </div>
              )}
              <div>
                <dt className="font-medium">Impact rating</dt>
                <dd>
                  {submittedData.impact
                    ? `${submittedData.impact} – ${scaleLabels[submittedData.impact]}`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Confidence evaluating AI</dt>
                <dd>
                  {submittedData.confidence
                    ? `${submittedData.confidence} – ${scaleLabels[submittedData.confidence]}`
                    : "—"}
                </dd>
              </div>
              {submittedData.concerns.length > 0 && (
                <div>
                  <dt className="font-medium">Concerns</dt>
                  <dd>{submittedData.concerns.join(", ")}</dd>
                </div>
              )}
              {submittedData.campusSupport && (
                <div>
                  <dt className="font-medium">Desired campus support</dt>
                  <dd>{submittedData.campusSupport}</dd>
                </div>
              )}
              {submittedData.biggestBenefit && (
                <div>
                  <dt className="font-medium">Biggest benefit</dt>
                  <dd>{submittedData.biggestBenefit}</dd>
                </div>
              )}
            </dl>
          </aside>
        )}
      </div>
    </div>
  );
}
