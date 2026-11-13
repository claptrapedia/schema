import { Enums } from "#shared";

export const Element = Enums.Element.extract([
  "none",
  "incendiary",
  "corrosive",
  "shock",
  "explosive",
]).describe(Enums.Element.description!);