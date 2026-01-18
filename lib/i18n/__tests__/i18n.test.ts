import { describe, it, expect } from "vitest";
import { dictionaries } from "../index";

describe("i18n Dictionaries", () => {
  it("should have matching keys between ko and en", () => {
    const koKeys = Object.keys(dictionaries.ko);
    const enKeys = Object.keys(dictionaries.en);
    expect(koKeys).toEqual(enKeys);

    expect(Object.keys(dictionaries.ko.nav)).toEqual(Object.keys(dictionaries.en.nav));
    
    expect(Object.keys(dictionaries.ko.common)).toEqual(Object.keys(dictionaries.en.common));

    expect(Object.keys(dictionaries.ko.home)).toEqual(Object.keys(dictionaries.en.home));
  });

  it("should provide correct translations for known keys", () => {
    expect(dictionaries.ko.nav.home).toBe("홈");
    expect(dictionaries.en.nav.home).toBe("Home");
  });
});
