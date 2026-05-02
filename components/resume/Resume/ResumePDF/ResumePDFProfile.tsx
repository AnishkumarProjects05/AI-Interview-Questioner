import { View } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "@/components/resume/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "@/components/resume/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "@/components/resume/Resume/ResumePDF/common";
import type { ResumeProfile } from "@/lib/resume/redux/types";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, email, phone, url, summary, location, personalLinks = [] } = profile;
  const iconProps = { phone, email, url, location };

  return (
    // Centered header section — no themeColor heading, just name + contact row
    <ResumePDFSection style={{ marginTop: isPDF ? spacing["0"] : spacing["4"], alignItems: "center" }} isPDF={isPDF}>
      {/* Large centered name */}
      <ResumePDFText
        bold={true}
        style={{ fontSize: "22pt", textAlign: "center", letterSpacing: "1pt" }}
      >
        {name}
      </ResumePDFText>

      {/* Contact icons in one centered row */}
      <View
        style={{
          ...styles.flexRow,
          flexWrap: "wrap",
          justifyContent: "center",
          gap: spacing["3"],
          marginTop: spacing["1"],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) iconType = "url_github";
            else if (value.includes("linkedin")) iconType = "url_linkedin";
          }

          const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;
            let src = "";
            switch (key) {
              case "email": src = `mailto:${value}`; break;
              case "phone": src = `tel:${value.replace(/[^\d+]/g, "")}`; break;
              default: src = value.startsWith("http") ? value : `https://${value}`;
            }
            return <ResumePDFLink src={src} isPDF={isPDF}>{children}</ResumePDFLink>;
          };

          return (
            <View
              key={key}
              style={{ ...styles.flexRow, alignItems: "center", gap: spacing["1"] }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <Wrapper>
                <ResumePDFText style={{ fontSize: "9.5pt" }}>{value}</ResumePDFText>
              </Wrapper>
            </View>
          );
        })}

        {/* Custom Personal Links */}
        {personalLinks.map((link, idx) => {
          if (!link.label || !link.url) return null;

          let iconType: IconType = "url";
          if (link.url.includes("github")) iconType = "url_github";
          else if (link.url.includes("linkedin")) iconType = "url_linkedin";

          const src = link.url.startsWith("http") ? link.url : `https://${link.url}`;

          return (
            <View
              key={`link-${idx}`}
              style={{ ...styles.flexRow, alignItems: "center", gap: spacing["1"] }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <ResumePDFLink src={src} isPDF={isPDF}>
                <ResumePDFText style={{ fontSize: "9.5pt" }}>{link.label}</ResumePDFText>
              </ResumePDFLink>
            </View>
          );
        })}
      </View>

      {/* Optional objective/summary beneath contact */}
      {summary && (
        <ResumePDFText style={{ marginTop: spacing["2"], textAlign: "center", fontSize: "9.5pt" }}>
          {summary}
        </ResumePDFText>
      )}
    </ResumePDFSection>
  );
};
