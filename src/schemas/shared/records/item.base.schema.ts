import { z } from "zod";

import { String } from "#shared/primitives/index.js";

export const BaseItem = z.object({
  id: z.string(),
  summary: String.Line,
  description: String.Lines.optional(),
}).describe("id is its stable identifier. summary is a single-line overview. Add description, one paragraph per entry, only when a longer explanation is supported by evidence. For an item family, one record is the family: do not create a separate record for each level, part combination, or roll.");