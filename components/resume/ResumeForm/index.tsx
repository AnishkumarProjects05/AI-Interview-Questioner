"use client";
import { useState } from "react";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "@/lib/resume/redux/hooks";
import { ShowForm, selectFormsOrder } from "@/lib/resume/redux/settingsSlice";
import { ProfileForm } from "@/components/resume/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "@/components/resume/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "@/components/resume/ResumeForm/EducationsForm";
import { ProjectsForm } from "@/components/resume/ResumeForm/ProjectsForm";
import { SkillsForm } from "@/components/resume/ResumeForm/SkillsForm";
import { ThemeForm } from "@/components/resume/ResumeForm/ThemeForm";
import { CustomForm } from "@/components/resume/ResumeForm/CustomForm";
import { FlexboxSpacer } from "@/components/resume/FlexboxSpacer";
import { cx } from "@/lib/resume/cx";

const formTypeToComponent: { [type in ShowForm]: () => React.ReactElement } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={cx(
        "flex justify-center scrollbar scrollbar-track-gray-100 scrollbar-w-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll",
        isHover && "scrollbar-thumb-gray-200"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
        <ProfileForm />
        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}
        <ThemeForm />
        <br />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};



