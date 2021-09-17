//  🐈🌑 lune :: elements/application.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

import { Namespace, tag } from "../dom.js";
import { XHTML } from "../symbols.js";
import { STYLE } from "./html.js";

export class LuneApplication extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(STYLE()`@namespace "${Namespace[XHTML]}";
`);
  }
}

customElements.define("lune-application", LuneApplication);

export const LUNE_APPLICATION = tag("lune-application");
