import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useApplicationStore } from "../../store/useApplicationStore";
import { useNavigate } from "react-router-dom"; // <--- 1. Import useNavigate
import { saveApplication } from "../../api/portalApi";

// Types
import type { SlideConfig } from "../../types/onboarding";

// Layout & Wrapper
import ApplicationLayout from "../../components/layout/OnboardingLayout";
import QuestionSlide from "../../components/onboarding/QuestionSlide";

// Slide Components
import FormSlide from "../../components/onboarding/slides/FormSlide";
import OptionSlide from "../../components/onboarding/slides/OptionSlide";
import EssaySlide from "../../components/onboarding/slides/EssaySlide";
import ListSlide from "../../components/onboarding/slides/ListSlide";
import UploadSlide from "../../components/onboarding/slides/UploadSlide";
import InfoSlide from "../../components/onboarding/slides/InfoSlide";
import ReviewSlide from "../../components/onboarding/slides/ReviewSlide";
import ConsentSlide from "../../components/onboarding/slides/ConsentSlide";

import { API_URL } from "../../config";

interface ApplicationEngineProps {
  flowConfig: SlideConfig[];
  trackTitle: string;
}

export default function ApplicationEngine({
  flowConfig,
  trackTitle,
}: ApplicationEngineProps) {
  const store = useApplicationStore();
  const navigate = useNavigate(); // <--- 2. Initialize hook
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // <--- 3. Add Loading State

  // ... (Keep existing useMemo/useEffect logic for activeSlides & currentSlide) ...
  const activeSlides = useMemo(() => {
    return flowConfig.filter((slide) => {
      if (!slide.condition) return true;
      return slide.condition(store);
    });
  }, [store.venture.track, store.role, flowConfig]);

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
    (s) => s.sectionId === currentSectionId,
  );
  const localIndex = sectionSlides.findIndex((s) => s.id === currentSlide.id);
  const localProgress = ((localIndex + 1) / sectionSlides.length) * 100;

  // ... (Keep handleUpdate and getValue functions as is) ...
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
          store,
        ) || ""
    );
  };

  // --- NEW: SUBMIT FUNCTION ---
  const submitApplication = async () => {
    setIsSubmitting(true);
    const user = JSON.parse(localStorage.getItem("artpark_user") || "{}");

    if (!user.id) {
      alert("Session expired. Please log in.");
      navigate("/");
      return;
    }

    try {
      // ✅ USE THE NEW HELPER FUNCTION
      // passing 'SUBMITTED' as the 3rd argument
      await saveApplication(user.id, store, "SUBMITTED");

      console.log("✅ Application successfully submitted!");
      navigate("/application-success", { state: { userId: user.id } });
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Navigation (Updated with Submit Logic)
  const next = () => {
    if (currentIndex < activeSlides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // LAST SLIDE REACHED -> SUBMIT
      console.log("Submitting Form...", store);
      submitApplication();
    }
  };

  const back = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // ... (Keep checkCanProceed and renderSlideContent as is) ...
  const checkCanProceed = (): boolean => {
    const s = currentSlide;
    switch (s.type) {
      case "form":
        return (
          s.props?.inputs?.every((i) => !i.required || !!getValue(i.field)) ??
          true
        );
      case "option":
        // Specialized check for Innovator Status
        if (s.id === "status") return !!store.innovator.professionalStatus;
        if (s.id === "skills") return !!store.innovator.primarySkill;
        // ... Founder checks ...
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
            (q) => !q.minChars || getValue(q.field).length >= q.minChars,
          ) ?? true
        );
      case "upload":
        return true; // Optional for Innovator for now
      case "consent":
        // Check if all checkboxes defined in props are true in the store
        const requiredKeys = s.props?.items?.map((i: any) => i.id) || [];
        return requiredKeys.every(
          (key: string) =>
            store.declarations[key as keyof typeof store.declarations],
        );
      default:
        return true;
    }
  };

  // --- HANDLER FOR EDITING STEPS ---
  const handleJumpToStep = (stepId: string) => {
    // Find the index of the slide with the matching 'id' in the ACTIVE slides list
    const targetIndex = activeSlides.findIndex((slide) => slide.id === stepId);

    if (targetIndex !== -1) {
      setCurrentIndex(targetIndex);
    } else {
      console.warn(`Step with ID '${stepId}' not found in active flow.`);
    }
  };

  const renderSlideContent = (slide: SlideConfig) => {
    // ... (Keep your existing switch case logic exactly as is) ...
    // Copy-paste the switch(slide.type) block from your existing file here
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
            onEdit={handleJumpToStep} // <--- Add this line
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
      <AnimatePresence mode="wait">
        <QuestionSlide
          key={currentSlide.id}
          isActive={true}
          title={currentSlide.title}
          subtitle={
            currentSlide.type === "intro" ? undefined : currentSlide.subtitle
          }
          onNext={next} // Updated Next Function
          onBack={currentIndex > 0 ? back : undefined}
          canProceed={checkCanProceed() && !isSubmitting} // Disable if submitting
        >
          {/* Show a Loading Overlay if submitting */}
          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">
                Submitting Application...
              </p>
            </div>
          ) : (
            renderSlideContent(currentSlide)
          )}
        </QuestionSlide>
      </AnimatePresence>
    </ApplicationLayout>
  );
}
