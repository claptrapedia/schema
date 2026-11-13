import { z } from "zod";

export const Version = z.enum([
  "goty",
  "goty-enhanced",
]).describe("One Borderlands edition. Use goty for the Game of the Year release and goty-enhanced for the enhanced release. This is a single edition, not a releases list, patch number, or schema version. Include version only when the item is absent from the original release, standard. If the item is in standard, omit version.");