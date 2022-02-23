import {
  isAllowedContentType,
  isValidOrderStatus,
  orderStatus,
  supportedContentTypes,
} from "../../utils/utils";

describe("Utils", () => {
  describe("isAllowedContentType", () => {
    it("should return false when enter an invalid content type", () => {
      expect(isAllowedContentType("invalid type")).toBe(false);
    });

    it("should return true when enter a valid content type", () => {
      expect(isAllowedContentType(supportedContentTypes.png)).toBe(true);
    });
  });

  describe("isValidOrderStatus", () => {
    it("should return false when enter an invalid order status", () => {
      expect(isValidOrderStatus("invalid type")).toBe(false);
    });

    it("should return true when enter a valid order status", () => {
      expect(isValidOrderStatus(orderStatus.Created)).toBe(true);
    });
  });
});
