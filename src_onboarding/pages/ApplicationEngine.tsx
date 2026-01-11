import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useApplicationStore } from "../store/useApplicationStore";
import { useNavigate } from "react-router-dom";

// Types
import type { SlideConfig } from "../features/application/types/SlideTypes";

// Layout & Wrapper
import ApplicationLayout from "../features/application/layouts/ApplicationLayout";
import QuestionSlide from "../components/QuestionSlide";

// Slide Components
import FormSlide from "../components/slides/FormSlide";
import OptionSlide from "../components/slides/OptionSlide";
import EssaySlide from "../components/slides/EssaySlide";
import ListSlide from "../components/slides/ListSlide";
import UploadSlide from "../components/slides/UploadSlide";
import InfoSlide from "../components/slides/InfoSlide";
import ReviewSlide from "../components/slides/ReviewSlide";
import ConsentSlide from "../components/slides/ConsentSlide";

// --- CONFIG ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApplicationEngineProps {
  flowConfig: SlideConfig[];
  trackTitle: string;
}

export default function ApplicationEngine({
  flowConfig,
  trackTitle,
}: ApplicationEngineProps) {
  const store = useApplicationStore();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // To show small "Saving..." indicator

  // 1. Filter Slides
  const activeSlides = useMemo(() => {
    return flowConfig.filter((slide) => {
      if (!slide.condition) return true;
      return slide.condition(store);
    });
  }, [store.venture.track, store.role, flowConfig]);

  // 2. Get Current Slide
  const currentSlide = activeSlides[currentIndex];

  useEffect(() => {
    if (!currentSlide && activeSlides.length > 0) {
      setCurrentIndex(activeSlides.length - 1);
    }
  }, [activeSlides.length, currentSlide]);

  if (!currentSlide)
    return <div className="p-10 text-center">Loading Application...</div>;

  const currentSectionId = currentSlide.sectionId;
  const sectionSlides = activeSlides.filter(
    (s) => s.sectionId === currentSectionId
  );
  const localIndex = sectionSlides.findIndex((s) => s.id === currentSlide.id);
  const localProgress = ((localIndex + 1) / sectionSlides.length) * 100;

  // 3. Update Handler
  const handleUpdate = (path: string, value: any) => {
    const [domain, field] = path.split(".");
    if (domain === "founder") store.updateFounder({ [field]: value });
    else if (domain === "venture") store.updateVenture({ [field]: value });
    else if (domain === "innovator") store.updateInnovator({ [field]: value });
    else if (domain === "uploads") store.updateUploads({ [field]: value });
    else if (domain === "declarations")
      store.updateDeclarations({ [field]: value });
  };

  const getValue = (path?: string) => {
    if (!path) return "";
    return (
      path
        .split(".")
        .reduce(
          (obj: any, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
          store
        ) || ""
    );
  };

  const handleJumpToStep = (stepId: string) => {
    // Find the index of the slide with the matching 'id' in the ACTIVE slides list
    const targetIndex = activeSlides.findIndex((slide) => slide.id === stepId);

    if (targetIndex !== -1) {
      setCurrentIndex(targetIndex);
    } else {
      console.warn(`Step with ID '${stepId}' not found in active flow.`);
      // Fallback: Try to map generic IDs if needed, or just alert user
    }
  };

  // --- NEW: SAVE DRAFT FUNCTION (Silent) ---
  const saveDraft = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("artpark_user") || "{}");

    if (!token || !user.id) return; // Cannot save if not logged in

    try {
      setIsSaving(true);
      await fetch(`${API_URL}/api/onboarding/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          data: store, // Send current state
          submit: false, // Important: Mark as DRAFT, not submitted
        }),
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- SUBMIT FUNCTION (Final) ---
  const submitApplication = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("artpark_user") || "{}");

    if (!token || !user.id) {
      alert("You are not logged in. Please log in to submit.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/onboarding/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          data: store,
          submit: true, // Mark as SUBMITTED
        }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "Submission failed");

      // Redirect to Success Page
      navigate("/application-submitted");
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Navigation (Now triggers Save)
  const next = () => {
    if (currentIndex < activeSlides.length - 1) {
      // SAVE DRAFT before moving to next slide
      saveDraft();
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Final Slide -> Submit
      submitApplication();
    }
  };

  const back = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // 5. Validation
  const checkCanProceed = (): boolean => {
    const s = currentSlide;
    switch (s.type) {
      case "form":
        return (
          s.props?.inputs?.every((i) => !i.required || !!getValue(i.field)) ??
          true
        );
      case "option":
        if (s.id === "status") return !!store.innovator.professionalStatus;
        if (s.id === "skills") return !!store.innovator.primarySkill;
        return s.id === "track_selection"
          ? !!store.venture.track
          : s.id === "vertical"
          ? !!store.venture.vertical
          : s.id === "tech_category"
          ? store.venture.techCategory.length > 0
          : s.id === "trl_level"
          ? !!store.venture.trlLevel
          : true;
      case "essay":
        return (
          s.props?.questions?.every(
            (q) => !q.minChars || getValue(q.field).length >= q.minChars
          ) ?? true
        );
      case "consent":
        const requiredKeys = s.props?.items?.map((i: any) => i.id) || [];
        return requiredKeys.every(
          (key: string) =>
            store.declarations[key as keyof typeof store.declarations]
        );
      default:
        return true;
    }
  };

  const renderSlideContent = (slide: SlideConfig) => {
    switch (slide.type) {
      case "intro":
        return <InfoSlide type="intro" content={slide.subtitle} />;
      case "form":
        return (
          <FormSlide
            inputs={slide.props?.inputs || []}
            values={store}
            onUpdate={handleUpdate}
          />
        );
      case "option":
        let field = "dummy";
        if (slide.id === "status") field = "innovator.professionalStatus";
        else if (slide.id === "skills") field = "innovator.primarySkill";
        else if (slide.id === "track_selection") field = "venture.track";
        else if (slide.id === "vertical") field = "venture.vertical";
        else if (slide.id === "tech_category") field = "venture.techCategory";
        else if (slide.id === "trl_level") field = "venture.trlLevel";
        else if (slide.id === "iir_commitment") field = "venture.commitment";
        return (
          <OptionSlide
            options={slide.props?.options || []}
            selected={getValue(field)}
            multiSelect={slide.props?.multiSelect}
            onSelect={(val: string) => {
              if (slide.props?.multiSelect) {
                const currentArray = (getValue(field) as string[]) || [];
                const newValue = currentArray.includes(val)
                  ? currentArray.filter((item) => item !== val)
                  : [...currentArray, val];
                handleUpdate(field, newValue);
              } else {
                handleUpdate(field, val);
              }
            }}
          />
        );
      case "essay":
        return (
          <EssaySlide
            questions={slide.props?.questions || []}
            values={store}
            onUpdate={handleUpdate}
          />
        );
      case "list":
        return <ListSlide />;
      case "upload":
        return (
          <UploadSlide
            files={slide.props?.files || []}
            values={store}
            onUpdate={(key, val) => store.updateUploads({ [key]: val })}
          />
        );
      case "review":
        return (
          <ReviewSlide
            data={store}
            onEdit={handleJumpToStep} // <--- Pass the jump function
          />
        );
      case "consent":
        return (
          <ConsentSlide
            items={(slide.props?.items || []) as any}
            values={store.declarations}
            onUpdate={(field, val) =>
              store.updateDeclarations({ [field]: val })
            }
          />
        );
      default:
        return <div>Unknown Slide</div>;
    }
  };

  if (isSubmitting) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white z-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold">Submitting Application...</h2>
        <p className="text-gray-500">Please do not close this window.</p>
      </div>
    );
  }

  return (
    <ApplicationLayout
      currentSectionId={currentSectionId}
      localProgress={localProgress}
      trackTitle={trackTitle}
    >
      <div className="relative">
        {/* Saving Indicator (Top Right) */}
        {isSaving && (
          <div className="absolute -top-40px right-0 text-xs text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded-md">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
            Saving draft...
          </div>
        )}

        <AnimatePresence mode="wait">
          <QuestionSlide
            key={currentSlide.id}
            isActive={true}
            title={currentSlide.title}
            subtitle={
              currentSlide.type === "intro" ? undefined : currentSlide.subtitle
            }
            onNext={next}
            onBack={currentIndex > 0 ? back : undefined}
            canProceed={checkCanProceed() && !isSubmitting}
          >
            {renderSlideContent(currentSlide)}
          </QuestionSlide>
        </AnimatePresence>
      </div>
    </ApplicationLayout>
  );
}
