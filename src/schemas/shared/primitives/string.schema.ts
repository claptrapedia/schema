import { z } from "zod";

/**
 * Schema for a single line of text.
 *
 * @remarks
 * The line must contain visible text. Blank lines, whitespace-only lines, and line breaks are rejected.
 */
export const Line = z.string().regex(/^[^\r\n]*\S[^\r\n]*$/).describe("One line of text. It must contain at least one non-whitespace character and must not include a line break. Do not emit a blank or whitespace-only line.");

/**
 * Schema for ordered paragraphs.
 *
 * @remarks
 * Each entry is one paragraph in source order, without markup. Joined paragraphs, blank entries, and whitespace-only
 * entries are rejected.
 */
export const Lines = z.array(Line).describe("Ordered paragraphs, one string per entry, equivalent to one <p> each. Split on paragraph boundaries in source order. Do not join paragraphs inside a single string, do not include the tags, and do not include a blank or whitespace-only entry.");

/**
 * Schema for a lowercase hyphenated slug.
 *
 * @remarks
 * Each segment is letters or digits. Spaces, underscores, capitals, and leading, trailing, or doubled hyphens are
 * rejected.
 */
export const Slug = z.stringFormat("slug", /^[a-z0-9]+(?:-[a-z0-9]+)*$/).describe("Lowercase slug: one or more segments of letters or digits, joined by single hyphens. No spaces, underscores, uppercase, leading or trailing hyphens, or empty segments.");

/**
 * Schema for a strict major, minor, and patch version.
 *
 * @remarks
 * Three non-negative integers separated by dots, with no leading zeros. Prefixes, pre-release tags, and build metadata
 * are rejected.
 */
export const Semvar = z.stringFormat("semver", /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/).describe("Strict MAJOR.MINOR.PATCH version. Three non-negative integers separated by dots, with no leading zeros. Do not add a v prefix, pre-release tag, or build metadata.");

/**
 * Schema for an image filename.
 *
 * @remarks
 * A lowercase slug followed by `.png` or `.webp`. Directories, URLs, and other extensions are rejected.
 */
export const ImgFileName = z.stringFormat("img-filename", /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:png|webp)$/).describe("Image filename only: a lowercase slug, then .png or .webp. No directory, URL, uppercase, spaces, or doubled hyphens. Do not use .jpg, .jpeg, or .gif.");
