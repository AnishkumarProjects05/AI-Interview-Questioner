import { Text, View } from "@react-pdf/renderer";
import {
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
} from "@/components/resume/Resume/ResumePDF/common";
import { styles, spacing } from "@/components/resume/Resume/ResumePDF/styles";
import type { ResumeEducation } from "@/lib/resume/redux/types";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
  isPDF = false,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
  isPDF?: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading} isPDF={isPDF}>
      {educations.map(({ school, degree, date, gpa, descriptions = [] }, idx) => {
        const hideSchoolName = idx > 0 && school === educations[idx - 1].school;
        const showDescriptions = descriptions.join() !== "";

        return (
          <View key={idx} style={idx !== 0 ? { marginTop: isPDF ? spacing["0"] : spacing["2"] } : {}}>
            {/* Row 1: School bold left + date right */}
            {!hideSchoolName && (
              <View style={{ ...styles.flexRowBetween, alignItems: "flex-end" }}>
                <ResumePDFText bold={true} style={{ fontSize: "10pt" }}>
                  {school}
                </ResumePDFText>
                <ResumePDFText style={{ fontSize: "9pt", color: "#444444" }}>
                  {date}
                </ResumePDFText>
              </View>
            )}
            {/* Row 2: Degree bold italic */}
            <View style={{ marginTop: isPDF ? spacing["0"] : spacing["0.5"] }}>
              <ResumePDFText bold={true} style={{ fontStyle: "italic", fontSize: "9.5pt", color: "#333333" }}>
                {gpa ? `${degree} — GPA: ${gpa}` : degree}
              </ResumePDFText>
            </View>
            {showDescriptions && (
              <View style={{ ...styles.flexCol, marginTop: isPDF ? spacing["0"] : spacing["0.5"] }}>
                <ResumePDFBulletList items={descriptions} showBulletPoints={showBulletPoints} isPDF={isPDF} />
              </View>
            )}
          </View>
        );
      })}
    </ResumePDFSection>
  );
};



