import {
  isAllowedContentType,
  supportedContentTypes,
} from "../../../utils/utils";

describe("utils.isAllowedContentType", () => {
  it("should return false when enter an invalid content type", () => {
    expect(isAllowedContentType("invalid type")).toBe(false);
  });

  it("should return true when enter a valid content type", () => {
    expect(isAllowedContentType(supportedContentTypes.png)).toBe(true);
  });
});
