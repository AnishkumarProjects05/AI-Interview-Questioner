import {
  matchOnlyLetterSpaceOrPeriod,
  matchEmail,
  matchPhone,
  matchUrl,
} from "@/lib/resume/parse-resume-from-pdf/extract-resume-from-sections/extract-profile";
import type { TextItem } from "@/lib/resume/parse-resume-from-pdf/types";

const makeTextItem = (text: string) =>
  ({
    text,
  } as TextItem);

describe("extract-profile tests - ", () => {
  it("Name", () => {
    expect(
      matchOnlyLetterSpaceOrPeriod(makeTextItem("Leonardo W. DiCaprio"))![0]
    ).toBe("Leonardo W. DiCaprio");
  });

  it("Email", () => {
    expect(matchEmail(makeTextItem("  hello@folonite.shop  "))![0]).toBe(
      "hello@folonite.shop"
    );
  });

  it("Phone", () => {
    expect(matchPhone(makeTextItem("  (123)456-7890  "))![0]).toBe(
      "(123)456-7890"
    );
  });

  it("Url", () => {
    expect(matchUrl(makeTextItem("  linkedin.com/in/folonite  "))![0]).toBe(
      "linkedin.com/in/folonite"
    );
    expect(matchUrl(makeTextItem("hello@folonite.shop"))).toBeFalsy();
  });
});


