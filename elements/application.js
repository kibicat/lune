//  🐈🌑 lune :: application.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

import { Namespace, STYLE, XHT, XHTML } from "../dom.js";

export class LuneApplication extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(STYLE()`@namespace "${Namespace[XHTML]}";
`);
  }
}

customElements.define("lune-application", LuneApplication);

export const LUNE_APPLICATION = XHT("lune-application");
