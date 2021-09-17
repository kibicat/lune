//  🐈🌑 lune :: deps.test.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

import {
  DOMImplementation,
  DOMParser,
  XMLSerializer,
} from "https://esm.sh/@xmldom/xmldom@0.7.5";

/**
 *  Polyfill for `element.append()`:
 *
 *  @argument {...(string | Node)} children
 */
Object.getPrototypeOf(
  new DOMImplementation().createDocument("about:blank", "x", null)
    .documentElement,
).append = function (...children) {
  for (const child of children) {
    if (typeof child === "string") {
      this.appendChild(this.ownerDocument.createTextNode(child));
    } else {
      this.appendChild(child);
    }
  }
};

/**
 *  “Polyfills” for custom elements:
 */
globalThis.HTMLElement = /** @type {typeof HTMLElement} */ (
  /** @type {unknown} */ (class HTMLElement {})
);
globalThis.customElements = /** @type {CustomElementRegistry} */ (
  /** @type {unknown} */ ({
    define: () => {},
  })
);

export { DOMImplementation, DOMParser, XMLSerializer };

export {
  assert,
  assertEquals,
} from "https://deno.land/std@0.107.0/testing/asserts.ts";
