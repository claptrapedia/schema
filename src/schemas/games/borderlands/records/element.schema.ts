import { Records } from "#shared";

import { Element as Enum } from "#games/borderlands/enums/index.js";

export const Element = Records.Element.extend({
  id: Enum,
}).describe(Records.Element.description!);