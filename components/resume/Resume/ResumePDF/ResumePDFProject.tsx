import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "@/components/resume/Resume/ResumePDF/common";
import { styles, spacing } from "@/components/resume/Resume/ResumePDF/styles";
import type { ResumeProject } from "@/lib/resume/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  isPDF = false,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  isPDF?: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading} isPDF={isPDF}>
      {projects.map(({ project, date, techStack, descriptions }, idx) => (
        <View key={idx} style={idx !== 0 ? { marginTop: isPDF ? spacing["0"] : spacing["2"] } : {}}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: isPDF ? spacing["0"] : spacing["0.5"],
            }}
          >
            <ResumePDFText bold={true}>{project}</ResumePDFText>
            <ResumePDFText>{date}</ResumePDFText>
          </View>
          {techStack && (
            <View style={{ marginTop: isPDF ? spacing["0"] : spacing["0.5"] }}>
              <ResumePDFText
                style={{ fontSize: "10pt", fontStyle: "italic", fontWeight: "medium" }}
              >
                {techStack}
              </ResumePDFText>
            </View>
          )}
          <View style={{ ...styles.flexCol, marginTop: isPDF ? spacing["0"] : spacing["0.5"] }}>
            <ResumePDFBulletList items={descriptions} isPDF={isPDF} />
          </View>
        </View>
      ))}
    </ResumePDFSection>
  );
};



