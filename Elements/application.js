//  🐈🌑 lune :: Elements/application.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

import { makeTag } from "../dom.js";
import { STYLE } from "./html.js";
import { LUNE_COMPOSER } from "./composer.js";

export class LuneApplication extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.append(
      STYLE()`
:host{
  Position: Absolute;
  Inset-Block-Start: 0;
  Inset-Block-End: 0;
  Inset-Inline-Start: 0;
  Inset-Inline-End: 0;
}
`,
      LUNE_COMPOSER()``,
    );
  }
}

customElements.define("lune-application", LuneApplication);

export const LUNE_APPLICATION = makeTag.bind(null, "lune-application");
