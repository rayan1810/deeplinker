import { parseDeeplink } from "./index";

describe("parseDeeplink", () => {
  it("should parse a deep link with /l/ path", () => {
    const result = parseDeeplink(
      "https://example.com/l/welcome?param1=value1&param2=value2"
    );

    expect(result.slug).toBe("welcome");
    expect(result.params).toEqual({
      param1: "value1",
      param2: "value2",
    });
  });

  it("should parse a deep link with /d/ path", () => {
    const result = parseDeeplink("https://example.com/d/short?param1=value1");

    expect(result.slug).toBe("short");
    expect(result.params).toEqual({
      param1: "value1",
    });
  });

  it("should parse a deep link without query parameters", () => {
    const result = parseDeeplink("https://example.com/l/hello");

    expect(result.slug).toBe("hello");
    expect(result.params).toEqual({});
  });

  it("should handle invalid URLs gracefully", () => {
    const result = parseDeeplink("invalid-url");

    expect(result.slug).toBe("");
    expect(result.params).toEqual({});
  });
});
