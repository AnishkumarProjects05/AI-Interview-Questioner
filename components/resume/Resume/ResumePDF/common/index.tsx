import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "@/components/resume/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "@/lib/resume/constants";
import { DEFAULT_FONT_COLOR } from "@/lib/resume/redux/settingsSlice";

// Classic ATS-style section: heading in UPPERCASE bold + full-width bottom border
export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  isPDF = false,
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: Style;
  isPDF?: boolean;
  children: React.ReactNode;
}) => (
  <View
    style={{
      ...styles.flexCol,
      gap: isPDF ? spacing["0"] : spacing["2"],
      marginTop: isPDF ? spacing["1"] : spacing["4"],
      ...style,
    }}
  >
    {heading && (
      <View style={{ ...styles.flexCol, marginBottom: isPDF ? spacing["0.5"] : spacing["1"] }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "11pt",
            letterSpacing: "0.5pt",
            textTransform: "uppercase",
            color: "#000000",
            paddingBottom: spacing["0.5"],
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        >
          {heading}
        </Text>
        {/* Explicit horizontal line spanning full width */}
        <View style={{ height: "1pt", backgroundColor: "#a3a3a3", width: "100%" }} />
      </View>
    )}
    {children}
  </View>
);

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  children,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        color: themeColor || DEFAULT_FONT_COLOR,
        ...(bold ? { fontWeight: "bold" } : {}),
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {children}
    </Text>
  );
};

const renderNodeToReactPDF = (node: ChildNode, idx: number): React.ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    // Strip raw newlines that cause React-PDF staircase nested breaks!
    return (node.textContent || "").replace(/\n/g, ' ');
  }
  const el = node as HTMLElement;
  if (!el || !el.nodeName) return null;
  const tag = el.nodeName.toLowerCase();

  let inlineStyle: any = {};
  if (tag === 'b' || tag === 'strong') inlineStyle.fontWeight = 'bold';
  if (tag === 'i' || tag === 'em') inlineStyle.fontStyle = 'italic';
  if (tag === 'u') inlineStyle.textDecoration = 'underline';

  if (tag === 'span') {
    const styleAttr = el.getAttribute ? el.getAttribute('style') : null;
    if (styleAttr) {
      if (styleAttr.includes('font-weight: bold') || styleAttr.includes('font-weight: 700')) inlineStyle.fontWeight = 'bold';
      if (styleAttr.includes('font-style: italic')) inlineStyle.fontStyle = 'italic';
      if (styleAttr.includes('text-decoration: underline')) inlineStyle.textDecoration = 'underline';
    }
  }

  const childrenNodes = Array.from(node.childNodes).map((child, i) => renderNodeToReactPDF(child, i));

  if (Object.keys(inlineStyle).length > 0) {
    return <Text key={`wrap-${idx}`} style={inlineStyle}>{childrenNodes as any}</Text>;
  }

  return childrenNodes as any;
};

export const parseHTMLToReactPDF = (html: string) => {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return <Text>{html.replace(/<[^>]+>/g, '').replace(/\n/g, ' ')}</Text>;
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html || "", "text/html");
    return Array.from(doc.body.childNodes).map((node, i) => renderNodeToReactPDF(node, i));
  } catch (e) {
    return <Text>{html.replace(/<[^>]+>/g, '').replace(/\n/g, ' ')}</Text>;
  }
};

export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
  isPDF = false,
}: {
  items: string[];
  showBulletPoints?: boolean;
  isPDF?: boolean;
}) => {
  return (
    <>
      {items.map((item, idx) => (
        <View style={{ ...styles.flexRow }} key={idx}>
          {showBulletPoints && (
            <ResumePDFText
              style={{
                paddingLeft: spacing["2"],
                paddingRight: spacing["2"],
                lineHeight: isPDF ? "1.1" : "1.3",
              }}
              bold={true}
            >
              {"•"}
            </ResumePDFText>
          )}
          <View style={{ flex: 1 }}>
            <ResumePDFText style={{ lineHeight: isPDF ? "1.1" : "1.3" }}>
              {parseHTMLToReactPDF(item)}
            </ResumePDFText>
          </View>
        </View>
      ))}
    </>
  );
};

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <ResumePDFText style={{ marginRight: spacing[0.5] }}>
        {skill}
      </ResumePDFText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: "100%",
          }}
        />
      ))}
    </View>
  );
};
