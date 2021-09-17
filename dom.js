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

export const MathMLNamespace = Symbol("MathML Namespace");
export const NullNamespace = Symbol("Null Namespace");
export const SVGNamespace = Symbol("SVG Namespace");
export const XHTMLNamespace = Symbol("XHTML Namespace");
export const XMLNamespace = Symbol("XML Namespace");

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
  static [MathMLNamespace] = new Namespace(
    "math",
    "http://www.w3.org/1998/Math/MathML",
  );
  static [NullNamespace] = new Namespace("", "");
  static [SVGNamespace] = new Namespace(
    "svg",
    "http://www.w3.org/2000/svg",
  );
  static [XHTMLNamespace] = new Namespace(
    "html",
    "http://www.w3.org/1999/xhtml",
  );
  static [XMLNamespace] = new Namespace(
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
   * @argument {string | Namespace} namespace
   * @argument {any} name
   */
  constructor(namespace, name) {
    super(name);
    /** @readonly */
    this.namespace = new Namespace(
      namespace instanceof Namespace ? namespace.prefix : "",
      namespace,
    );
    return Object.freeze(this);
  }
}

/**
 *  Tags a template literal to return an element.
 *
 *  Examples:—
 *
 *  ```js
 *  const divElement = element`div`.
 *  const withAttrs = element`div${{ class: "foo "}}`
 *  const withText = element`div${{}}content`
 *  const withNamespace = element`${Namespace[SVGNamespace]}svg`
 *  ```
 *
 *  The first substitution after the tag name must provide the
 *    attributes for the element.
 *  Remaining substitutions are included in content, and can be
 *    elements themselves.
 *
 * @this {any}
 * @argument {TemplateStringsArray} strings
 * @argument {[] | [Namespace, object | Map<Namespaced | string, string>, ...(string | Node)[]] | [object | Map<Namespaced | string, string>, ...(string | Node)[]]} substitutions
 * @returns {Element}
 */
export function XHT(strings, ...substitutions) {
  const document = this?.document ?? globalThis.document;
  const namespaced = strings[0] == "";
  const [namespace, attributes, ...subsChildren] = namespaced
    ? substitutions
    : [Namespace[XHTMLNamespace], ...substitutions];
  const [_, tagName, ...strChildren] = namespaced
    ? strings.raw
    : ["", ...strings.raw];
  const element = document.createElementNS(
    String(namespace),
    namespace instanceof Namespace && namespace.prefix
      ? `${namespace.prefix}:${tagName.trim()}`
      : tagName.trim(),
  );
  const attributeEntries = attributes instanceof Map
    ? attributes.entries()
    : Object.entries(attributes ?? {});
  for (const [key, value] of attributeEntries) {
    if (key instanceof Namespaced) {
      const keyNamespace = key.namespace;
      element.setAttributeNS(
        String(keyNamespace),
        keyNamespace.prefix
          ? `${keyNamespace.prefix}:${key}`
          : String(key),
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
    i < Math.max(subsChildren.length, strChildren.length);
    i++
  ) {
    if (Object.prototype.hasOwnProperty.call(strChildren, i)) {
      const child = strChildren[i];
      if (child != "") {
        children.push(child);
      }
    }
    if (Object.prototype.hasOwnProperty.call(subsChildren, i)) {
      //  Typechecking is disabled here because the first child of
      //    `subsChildren` could be an attributes object if no
      //    namespace was declared.
      //  We fudge it by just converting anything without a `tagName`
      //    to a string.
      /** @type {any} */
      const child = subsChildren[i];
      if (child != "") {
        children.push("tagName" in child ? child : String(child));
      }
    }
  }
  element.append(...children);
  return element;
}
