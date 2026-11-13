import { z } from "zod";

export const Element = z.enum([
  "none",
  "incendiary",
  "corrosive",
  "shock",
  "explosive",
  "cryo",
]).describe("One element an item can spawn with. Fire is incendiary, not a separate value. List every element it can actually roll. Add none only alongside one or more real elements, to record that an elemental item can also spawn with no element. [\"none\"] alone is invalid. Omit elements when the item never spawns with an element.");
