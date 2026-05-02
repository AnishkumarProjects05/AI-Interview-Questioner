import { Form, FormSection } from "@/components/resume/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "@/components/resume/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "@/components/resume/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "@/lib/resume/redux/hooks";
import { selectProjects, changeProjects } from "@/lib/resume/redux/resumeSlice";
import type { ResumeProject } from "@/lib/resume/redux/types";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const showDelete = projects.length > 1;

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, date, techStack, descriptions }, idx) => {
        const handleProjectChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          dispatch(changeProjects({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={"Delete project"}
          >
            <Input
              name="project"
              label="Project Name"
              placeholder="Resume Builder"
              value={project}
              onChange={handleProjectChange as any}
              labelClassName="col-span-4"
            />
            <Input
              name="date"
              label="Date"
              placeholder="Winter 2024"
              value={date}
              onChange={handleProjectChange as any}
              labelClassName="col-span-2"
            />
            <Input
              name="techStack"
              label="Tech Stack"
              placeholder="React, Next.js, Tailwind CSS"
              value={techStack}
              onChange={handleProjectChange as any}
              labelClassName="col-span-full"
            />
            <BulletListTextarea
              name="descriptions"
              label="Description"
              placeholder="Bullet points"
              value={descriptions}
              onChange={handleProjectChange as any}
              labelClassName="col-span-full"
            />
          </FormSection>
        );
      })}
    </Form>
  );
};




