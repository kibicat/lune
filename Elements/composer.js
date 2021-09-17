//  🐈🌑 lune :: Elements/composer.js
//  ===================================================================
//
//  Copyright © 2021 Margaret KIBI.
//
//  This Source Code Form is subject to the terms of the Mozilla
//    Public License, v. 2.0.
//  If a copy of the MPL was not distributed with this file, You can
//    obtain one at <https://mozilla.org/MPL/2.0/>.

import localize from "../Localization/mod.js";
import { makeTag } from "../dom.js";
import {
  BUTTON,
  DETAILS,
  DIV,
  LI,
  MENU,
  METER,
  SPAN,
  STYLE,
  SUMMARY,
  TEXTAREA,
} from "./html.js";

/**
 *  @this {HTMLTextAreaElement}
 *  @argument {HTMLMeterElement} meter
 *  @argument {HTMLSpanElement} count
 */
function update(meter, count) {
  const chars = this.value.length;
  meter.value = Math.min(chars, meter.max);
  count.textContent = chars.toString();
}

export class LuneComposer extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const textArea = TEXTAREA({
      placeholder: localize`🐈🌑 :: Composer :: Placeholder`,
    })``;
    const meter = /** @type {HTMLMeterElement} */ (METER({
      value: "0",
      min: "0",
      max: "500",
      high: "450",
    })``);
    const count = /** @type {HTMLSpanElement} */ (SPAN()`0`);
    const submit = BUTTON({ type: "button" })`${localize
      `🐈🌑 :: Composer :: Make Post`}`;
    textArea.addEventListener(
      "input",
      update.bind(textArea, meter, count),
    );
    update.call(textArea, meter, count);
    shadowRoot.append(
      STYLE()`
details.DRAWER{
  Position: Absolute;
  Box-Sizing: Border-Box;
  Inset-Block-End: 0;
  Inset-Inline-Start: 0;
  Inset-Inline-End: 0;
  Border-Block-Start: Thin Solid;
  Writing-Mode: Vertical-RL;
}
details.DRAWER>summary{
  Box-Sizing: Border-Box;
  Margin: 0;
  Block-Size: 2.25REM;
  Font-Size: 1.5REM;
  Font-Style: Italic;
  Line-Height: 1.5;
  Letter-Spacing: Calc(1EM / 18);
}
details.DRAWER[open]>summary{
  Margin-Block-End: -1PX;
  Border-Block-End: 1PX Solid;
}
details.DRAWER>div{
  Display: Grid;
  Grid: 1FR Auto / Auto-Flow;
  Box-Sizing: Border-Box;
  Padding-Block-Start: 1EM;
  Padding-Block-End: 1EM;
  Padding-Inline-Start: 1EM;
  Padding-Inline-End: 1EM;
  Block-Size: 100%;
  Inline-Size: 18EM;
  Max-Inline-Size: Calc(100VW - 2.25REM);
  Writing-Mode: Horizontal-TB;
}
div.COMPOSE{
  Display: Grid;
  Padding-Block-End: .5EM;
  Grid: 1FR Max-Content Max-Content / Auto-Flow;
}
textarea{
  Display: Block;
  Box-Sizing: Border-Box;
  Inline-Size: 100%;
  Block-Size: 100%;
  Resize: None;
}
menu{
  Display: Grid;
  Margin-Block-Start: .5EM;
  Margin-Block-End: .5EM;
  Margin-Inline-Start: Auto;
  Margin-Inline-End: 0;
  Padding: 0;
  Grid: Min-Content / Auto-Flow;
}
menu>li{
  All: Initial;
}
div.COUNT{
  Display: Grid;
  Grid: Auto-Flow / 1FR Max-Content;
  Gap: 1CH;
}
details.PREVIEW{
  Box-Sizing: Border-Box;
  Margin-Inline-Start: -.5EM;
  Margin-Inline-End: -.5EM;
  Border-Block-Start: Thin Solid;
  Padding-Block-Start: .5EM;
  Padding-Inline-Start: .5EM;
  Padding-Inline-End: .5EM;
}
details.PREVIEW[open]{
  Block-Size: 50VH;
}
`,
      DETAILS({ class: "DRAWER" })`${[
        SUMMARY()`${localize`🐈🌑 :: Composer :: Title`}`,
        DIV()`${[
          DIV({ class: "COMPOSE" })`${[
            textArea,
            MENU()`${[
              LI()`${submit}`,
            ]}`,
            DIV({ class: "COUNT" })`${[
              meter,
              SPAN()`${count} ∕ ${meter.max.toString()}`,
            ]}`,
          ]}`,
          DETAILS({ class: "PREVIEW", open: "" })`${[
            SUMMARY()`${localize`🐈🌑 :: Composer :: Preview`}`,
            DIV()`[TODO: Post preview!]`,
          ]}`,
        ]}`,
      ]}`,
    );
  }
}

customElements.define("lune-composer", LuneComposer);

export const LUNE_COMPOSER = makeTag.bind(null, "lune-composer");
