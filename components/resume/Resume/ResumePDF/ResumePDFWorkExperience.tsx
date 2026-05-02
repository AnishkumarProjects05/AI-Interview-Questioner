import { Text, View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "@/components/resume/Resume/ResumePDF/common";
import { styles, spacing } from "@/components/resume/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "@/lib/resume/redux/types";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
  isPDF = false,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
  isPDF?: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading} isPDF={isPDF}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View key={idx} style={idx !== 0 ? { marginTop: isPDF ? spacing["0"] : spacing["2"] } : {}}>
            {/* Row 1: Company (bold) + Date (right-aligned) */}
            {!hideCompanyName && (
              <View style={{ ...styles.flexRowBetween, alignItems: "flex-end" }}>
                <ResumePDFText bold={true} style={{ fontSize: "10pt" }}>
                  {company}
                </ResumePDFText>
                <ResumePDFText style={{ fontSize: "9pt", color: "#444444" }}>
                  {date}
                </ResumePDFText>
              </View>
            )}
            {/* Row 2: Job title (bold italic) */}
            <View style={{ marginTop: isPDF ? spacing["0"] : spacing["0.5"] }}>
              <ResumePDFText bold={true} style={{ fontStyle: "italic", fontSize: "9.5pt", color: "#333333" }}>
                {jobTitle}
              </ResumePDFText>
            </View>
            {/* Bullet descriptions */}
            <View style={{ ...styles.flexCol, marginTop: isPDF ? spacing["0"] : spacing["0.5"] }}>
              <ResumePDFBulletList items={descriptions} isPDF={isPDF} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
