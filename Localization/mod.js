//  🐈🌑 lune :: Localization/mod.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

import en from "./en.js";

/**
 *  Localizes a string according to the `lang` property of the document
 *    element.
 *
 *  Intended to be used as a template tag, like follows:—
 *
 *  ```js
 *  const simpleLocalization = localize`Example`;
 *  const withSubstitutions =
 *    localize`Example 2 ${"Replacement 1"}${"Replacement 2"}`;
 *  ```
 *
 *  The Nth replacement will be used to replace any `🏷N` which
 *    appears in the localized string.
 *
 *  @this {any}
 *  @argument {TemplateStringsArray} strings
 *  @argument {...string} substitutions
 *  @returns {string}
 */
export default function localize(strings, ...substitutions) {
  const key = strings[0].trim();
  const possibleStrings = Object.assign(Object.create(null), {
    en,
  });
  const localizedStrings = (() => {
    /** @type {null | {[index: string]: {[index: string]: string}}} */
    let localizedStrings = null;
    const document = this?.document ?? globalThis.document;
    const lang = document.documentElement.lang || "en";
    const subtags = lang.split("-");
    while (subtags.length > 0 && strings == null) {
      localizedStrings = possibleStrings[subtags.join("-")];
      subtags.pop();
    }
    return localizedStrings ?? Object.create(null);
  })();
  const string = localizedStrings[key] ?? en[key];
  return string == null ? key : string.replace(
    /🏷0*([1-9][0-9]*)/gu,
    (/** @type {string} */ label, /** @type {string} */ index) =>
      substitutions[+index - 1] ?? label,
  );
}
