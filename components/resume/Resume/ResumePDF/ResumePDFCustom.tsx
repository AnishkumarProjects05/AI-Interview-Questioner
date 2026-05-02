import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
} from "@/components/resume/Resume/ResumePDF/common";
import { styles } from "@/components/resume/Resume/ResumePDF/styles";
import type { ResumeCustom } from "@/lib/resume/redux/types";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  showBulletPoints,
  isPDF = false,
}: {
  heading: string;
  custom: ResumeCustom;
  themeColor: string;
  showBulletPoints: boolean;
  isPDF?: boolean;
}) => {
  const { descriptions } = custom;

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading} isPDF={isPDF}>
      <View style={{ ...styles.flexCol }}>
        <ResumePDFBulletList
          items={descriptions}
          showBulletPoints={showBulletPoints}
        />
      </View>
    </ResumePDFSection>
  );
};



