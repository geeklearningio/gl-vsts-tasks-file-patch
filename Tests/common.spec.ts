import { removeBom, restoreBom } from "../Tasks/JsonPatch/common/bom";

describe("BOM Test", () => {
  const source = "\uFEFF{}";

  it("should roundtrip", () => {
    expect(restoreBom(removeBom(source))).toBe(source);
  });

  it("detect and remove bom", () => {
    const bomDetection = removeBom(source);

    expect(bomDetection.hadBOM).toBeTruthy();
    expect(bomDetection.content).toBe("{}");
  });

  it("leave untouched", () => {
    const bomDetection = removeBom("{}");

    expect(bomDetection.hadBOM).toBeFalsy();
    expect(bomDetection.content).toBe("{}");
  });
});
