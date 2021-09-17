//  🐈🌑 lune :: dom.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

import { MATHML, NULL, SVG, XHTML, XML } from "./symbols.js";

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
export class QualifiedName extends String {
  /**
   *  Makes a new `QualifiedName` object.
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
 *  @argument {QualifiedName} name
 *  @argument {{[index: string]: string} | Map<string | QualifiedName, string>} attributes
 *  @argument {TemplateStringsArray} strings
 *  @argument {...(string | Node |(string | Node)[])} substitutions
 *  @returns {Element}
 */
function elementTag(name, attributes, strings, ...substitutions) {
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
    if (key instanceof QualifiedName) {
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
 *  @argument {QualifiedName} name
 *  @argument {({[index: string]: string} | Map<string | QualifiedName, string>)=} attributes
 */
function namedTag(name, attributes = {}) {
  return elementTag.bind(this, name, attributes);
}

/**
 *  Tags a template literal to return an element.
 *
 *  Examples:—
 *
 *  ```js
 *  const divElement = tag("div")()`content`.
 *  const withAttrs = tag("div")({class: "foo"})`content`
 *  const withNamespace = tag(
 *    new QualifiedName(Namespace[SVG], "svg")
 *  )()`content`
 *  ```
 *
 *  The content may contain substitutions, which may be used to provide
 *    child elements.
 *
 * @this {?{document: Document}=}
 * @argument {string | QualifiedName} name
 */
export function tag(name) {
  return namedTag.bind(
    this,
    name instanceof QualifiedName
      ? name
      : new QualifiedName(Namespace[XHTML], name),
  );
}
