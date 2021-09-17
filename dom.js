//  🐈🌑 lune :: dom.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

/*
The following are *symbols*, not namespaces.
Access the appropriate namespace via `Namespace[symbol]`.
*/

export const MATHML = Symbol("math");
export const NULL = Symbol("");
export const SVG = Symbol("svg");
export const XHTML = Symbol("xhtml");
export const XML = Symbol("xml");

/**
 *  A `String` object with an associated `prefix`.
 *
 *  Please note the following:—
 *
 *   +  This is a `String` object, not a string primative.
 *      Use `==` not `===` for comparing with other strings.
 *
 *   +  The value of `name` *should be*, but is not required to be, a
 *        (LE)IRI.
 *      It may be something entirely different.
 *
 *   +  The value of `prefix` *should be*, but is not required to be, a
 *        `NCName`.
 *      If it isn’t, an error will be thrown should you actually
 *        attempt to *use* this `Namespace`.
 */
export class Namespace extends String {
  static [MATHML] = new Namespace(
    "math",
    "http://www.w3.org/1998/Math/MathML",
  );
  static [NULL] = new Namespace("", "");
  static [SVG] = new Namespace("svg", "http://www.w3.org/2000/svg");
  static [XHTML] = new Namespace(
    "html",
    "http://www.w3.org/1999/xhtml",
  );
  static [XML] = new Namespace(
    "xml",
    "http://www.w3.org/XML/1998/namespace",
  );
  /**
   *  Makes a new `Namespace` object.
   *
   * @argument {any} prefix
   * @argument {any} name
   */
  constructor(prefix, name) {
    super(name);
    /** @readonly */
    this.prefix = String(prefix);
    return Object.freeze(this);
  }
}

/**
 *  A `String` object with an associated `namespace`.
 *
 *  Please note the following:—
 *
 *   +  This is a `String` object, not a string primative.
 *      Use `==` not `===` for comparing with other strings.
 *
 *   +  The value of `namespace` *should be* a `Namespace`.
 *      It will attempt to create one otherwise.
 */
export class Namespaced extends String {
  /**
   *  Makes a new `Namespaced` object.
   *
   * @argument {any} namespace
   * @argument {any} localName
   */
  constructor(namespace, localName) {
    const prefix = namespace instanceof Namespace
      ? namespace.prefix
      : "";
    super(prefix == "" ? localName : `${prefix}:${localName}`);
    /** @readonly */
    this.localName = String(localName);
    /** @readonly */
    this.namespace = new Namespace(prefix, namespace);
    return Object.freeze(this);
  }
}

/**
 *  @this {?{document: Document}=}
 *  @argument {Namespaced} name
 *  @argument {{[index: string]: string} | Map<string | Namespaced, string>} attributes
 *  @argument {TemplateStringsArray} strings
 *  @argument {...(string | Node |(string | Node)[])} substitutions
 *  @returns {Element}
 */
function ElementTag(name, attributes, strings, ...substitutions) {
  const document = this?.document ?? globalThis.document;
  const namespace = name.namespace;
  const element = document.createElementNS(
    String(namespace),
    String(name),
  );
  const attributeEntries = attributes instanceof Map
    ? attributes.entries()
    : Object.entries(attributes);
  for (const [key, value] of attributeEntries) {
    if (key instanceof Namespaced) {
      const keyNamespace = key.namespace;
      element.setAttributeNS(
        String(keyNamespace),
        String(key),
        value,
      );
    } else {
      element.setAttribute(key, value);
    }
  }
  /** @type {(string | Node)[]} */
  const children = [];
  for (
    let i = 0;
    i < Math.max(strings.length, substitutions.length);
    i++
  ) {
    if (Object.prototype.hasOwnProperty.call(strings, i)) {
      const child = strings[i];
      if (child != "") {
        children.push(child);
      }
    }
    if (Object.prototype.hasOwnProperty.call(substitutions, i)) {
      const child = substitutions[i];
      if (Array.isArray(child)) {
        for (const subChild of child) {
          if (subChild != "") {
            children.push(subChild);
          }
        }
      } else if (child != "") {
        children.push(child);
      }
    }
  }
  element.append(...children);
  return element;
}

/**
 *  @this {?{document: Document}=}
 *  @argument {Namespaced} name
 *  @argument {({[index: string]: string} | Map<string | Namespaced, string>)=} attributes
 */
function NamedXHT(name, attributes = {}) {
  return ElementTag.bind(this, name, attributes);
}

/**
 *  Tags a template literal to return an element.
 *
 *  Examples:—
 *
 *  ```js
 *  const divElement = XHT("div")()`content`.
 *  const withAttrs = XHT("div")({class: "foo"})`content`
 *  const withNamespace = XHT("svg", Namespace[SVG])()`content`
 *  ```
 *
 *  The content may contain substitutions, which may be used to provide
 *    child elements.
 *
 * @this {?{document: Document}=}
 * @argument {string} localName
 * @argument {?Namespace=} namespace
 */
export function XHT(localName, namespace = Namespace[XHTML]) {
  return NamedXHT.bind(
    this,
    new Namespaced(
      namespace == null ? Namespace[NULL] : namespace,
      localName,
    ),
  );
}

export const A = XHT("a");
export const ABBR = XHT("abbr");
export const ADDRESS = XHT("address");
export const ARTICLE = XHT("article");
export const ASIDE = XHT("aside");
export const AUDIO = XHT("audio");
export const B = XHT("b");
export const BDI = XHT("bdi");
export const BDO = XHT("bdo");
export const BLOCKQUOTE = XHT("blockquote");
export const BR = XHT("br");
export const BUTTON = XHT("button");
export const CITE = XHT("cite");
export const CODE = XHT("code");
export const DATA = XHT("data");
export const DD = XHT("dd");
export const DEL = XHT("del");
export const DETAILS = XHT("details");
export const DFN = XHT("dfn");
export const DIV = XHT("div");
export const DL = XHT("dl");
export const DT = XHT("dt");
export const EM = XHT("em");
export const FIGCAPTION = XHT("figcaption");
export const FIGURE = XHT("figure");
export const FOOTER = XHT("footer");
export const H1 = XHT("h1");
export const HEADER = XHT("header");
export const I = XHT("i");
export const IFRAME = XHT("iframe");
export const IMG = XHT("img");
export const INPUT = XHT("input");
export const INS = XHT("ins");
export const KBD = XHT("kbd");
export const LABEL = XHT("label");
export const LI = XHT("li");
export const MARK = XHT("mark");
export const MENU = XHT("menu");
export const NAV = XHT("nav");
export const OL = XHT("ol");
export const OPTGROUP = XHT("optgroup");
export const OPTION = XHT("option");
export const OUTPUT = XHT("output");
export const P = XHT("p");
export const PICTURE = XHT("picture");
export const PRE = XHT("pre");
export const Q = XHT("q");
export const S = XHT("s");
export const SAMP = XHT("samp");
export const SECTION = XHT("section");
export const SELECT = XHT("select");
export const SMALL = XHT("small");
export const SOURCE = XHT("source");
export const SPAN = XHT("span");
export const STRONG = XHT("strong");
export const STYLE = XHT("style");
export const SUMMARY = XHT("summary");
export const TEXTAREA = XHT("textarea");
export const TIME = XHT("time");
export const TRACK = XHT("track");
export const U = XHT("u");
export const UL = XHT("ul");
export const VAR = XHT("var");
export const VIDEO = XHT("video");
export const WBR = XHT("wbr");
