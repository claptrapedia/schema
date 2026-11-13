import { z } from "zod";

/**
 * Schema for a fixed number or an inclusive roll range.
 *
 * @remarks
 * One number is a fixed value. Two numbers are the minimum and maximum, lowest first. A repeated pair or a third
 * number is rejected.
 */
export const OneOrTwoNumbers = z.union([
  z.tuple([z.number()]),
  z.tuple([z.number(), z.number()]),
]).describe("A fixed value or a roll range. Use one number when the stat does not roll, for example [2]. Use two numbers for the inclusive minimum and maximum, lowest first, for example [1, 4]. Do not repeat the same number as [2, 2], and do not add a third number.");