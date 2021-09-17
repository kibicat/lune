//  🐈🌑 lune :: dom.test.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

import {
  assert,
  assertEquals,
  DOMImplementation,
} from "./deps.test.js";
import { Namespace, Namespaced, XHT, XHTML, XML } from "./dom.js";

const implementation = new DOMImplementation();
globalThis.document = implementation.createDocument(
  Namespace[XHTML],
  "html",
  null,
);

Deno.test({
  name: "element makes empty element",
  fn: () => {
    const div = XHT("div", null)()``;
    assertEquals(div.nodeType, 1);
    assertEquals(div.tagName, "div");
    assertEquals(div.localName, "div");
    assert(!div.namespaceURI);
    assert(!div.hasChildNodes());
    assertEquals(div.attributes.length, 0);
  },
});

Deno.test({
  name: "element makes HTML element",
  fn: () => {
    const div = XHT("div")()``;
    assertEquals(div.nodeType, 1);
    assertEquals(div.nodeName, "html:div");
    assertEquals(div.localName, "div");
    assertEquals(div.namespaceURI, String(Namespace[XHTML]));
    assert(!div.hasChildNodes());
    assertEquals(div.attributes.length, 0);
  },
});

Deno.test({
  name: "element makes element with attributes",
  fn: () => {
    const div = XHT("div", null)({ "data-cool": "😎" })``;
    assertEquals(div.nodeType, 1);
    assertEquals(div.tagName, "div");
    assertEquals(div.localName, "div");
    assert(!div.namespaceURI);
    assert(!div.hasChildNodes());
    assertEquals(div.attributes.length, 1);
    assertEquals(div.getAttribute("data-cool"), "😎");
  },
});

Deno.test({
  name: "element makes HTML element with namespaced attributes",
  fn: () => {
    const div = XHT("div")(
      new Map([
        [new Namespaced(Namespace[XML], "lang"), "zxx"],
      ]),
    )``;
    assertEquals(div.nodeType, 1);
    assertEquals(div.nodeName, "html:div");
    assertEquals(div.localName, "div");
    assertEquals(div.namespaceURI, String(Namespace[XHTML]));
    assert(!div.hasChildNodes());
    assertEquals(div.attributes.length, 1);
    assertEquals(div.attributes[0].nodeName, "xml:lang");
    assertEquals(div.attributes[0].localName, "lang");
    assertEquals(
      div.attributes[0].namespaceURI,
      String(Namespace[XML]),
    );
    assertEquals(div.attributes[0].nodeValue, "zxx");
    assertEquals(
      div.getAttributeNS(String(Namespace[XML]), "lang"),
      "zxx",
    );
  },
});

Deno.test({
  name:
    "element makes HTML element with namespaced attributes and text and element content",
  fn: () => {
    const div = XHT("div")(
      new Map([
        [new Namespaced(Namespace[XML], "lang"), "en"],
      ]),
    )`some ${XHT("em")({ class: "COOL" })`cool`} content`;
    assertEquals(div.nodeType, 1);
    assertEquals(div.nodeName, "html:div");
    assertEquals(div.localName, "div");
    assertEquals(div.namespaceURI, String(Namespace[XHTML]));
    assertEquals(div.childNodes.length, 3);
    assertEquals(div.childNodes[0].nodeType, 3);
    assertEquals(div.childNodes[0].nodeValue, "some ");
    const em = /** @type {Element} */ (div.childNodes[1]);
    assertEquals(em.nodeType, 1);
    assertEquals(em.nodeName, "html:em");
    assertEquals(em.localName, "em");
    assertEquals(em.namespaceURI, String(Namespace[XHTML]));
    assertEquals(em.childNodes.length, 1);
    assertEquals(em.childNodes[0].nodeType, 3);
    assertEquals(em.childNodes[0].nodeValue, "cool");
    assertEquals(em.attributes.length, 1);
    assertEquals(em.attributes[0].nodeName, "class");
    assertEquals(em.attributes[0].localName, "class");
    assertEquals(em.attributes[0].namespaceURI, null);
    assertEquals(em.attributes[0].nodeValue, "COOL");
    assertEquals(em.getAttribute("class"), "COOL");
    assertEquals(div.childNodes[2].nodeType, 3);
    assertEquals(div.childNodes[2].nodeValue, " content");
    assertEquals(div.attributes.length, 1);
    assertEquals(div.attributes[0].nodeName, "xml:lang");
    assertEquals(div.attributes[0].localName, "lang");
    assertEquals(
      div.attributes[0].namespaceURI,
      String(Namespace[XML]),
    );
    assertEquals(div.attributes[0].nodeValue, "en");
    assertEquals(
      div.getAttributeNS(String(Namespace[XML]), "lang"),
      "en",
    );
  },
});
