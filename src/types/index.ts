// TEMP TO TEST TYPES

import { z } from "zod";

import { Borderlands } from "#games";

export type Element = z.infer<typeof Borderlands.Records.Element>;