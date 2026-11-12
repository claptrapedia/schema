# Claptrapedia schema

## Purpose

This repository defines the data contract for Claptrapedia, a Borderlands database covering the series. It is a TypeScript npm package built with Zod 4, exporting runtime schemas through `/schemas` and schema-inferred TypeScript types through `/types`.

The schemas describe records such as items, enemies, missions and locations, their shared components, game-specific attributes and relationships. Consumers use this contract to build, validate, import and display consistent data.

The website, data builder, extraction tools and actual content live in separate repositories. This package defines what valid data looks like. It does not scrape websites or contain a catalogue of individual weapons, enemies or other records.

## Project context

An AI-assisted builder creates data objects from game extractions and external sources, such as Lootlemon and the Borderlands wiki. It uses the schemas and their `.describe()` text to understand what to populate.

An extraction is evidence from a particular game release, not necessarily a complete catalogue or proof of availability in other releases. External sources must also match the relevant game and release.

The initial focus is Borderlands, with other games following the same shared foundations. Keep game-specific terminology and mechanics in their game modules rather than imposing them across the series.

## Repository organisation

Read `STRUCTURE.md` for the intended architecture. Inspect the relevant source files before changing a schema: the structure guide contains illustrative examples, not an exhaustive or always current field specification. Follow explicit user decisions when they supersede those examples.

- `schemas/shared/primitives/`: reusable field validators, such as IDs and text.
- `schemas/shared/enums/`: fixed allowed values across the series, such as weapon types and element IDs.
- `schemas/shared/utils/`: generic helpers, including collection schema factories.
- `schemas/shared/components/`: embedded structures, such as images, acquisition details and stats.
- `schemas/shared/records/`: common shapes for independently identified records.
- `schemas/games/`: game-specific enums, record schemas and dataset assembly.
- `validation/`: validation across collections, including declared relationships.
- `types/`: types inferred from schemas, without duplicate hand-maintained interfaces.

Keep files flat within these category folders. Group closely related variants in one schema file, such as enemy `Base`, `Standard`, `Named` and `Boss`. Use `Standard` for ordinary enemies. A named enemy can also be a boss; these classifications need not be exclusive.

Use shared schemas directly when sufficient, and extend or restrict them when a game requires it. Prefer explicit enum subsets with `.extract()` so adding a shared value does not silently allow it in every game.

Game-local release enums belong under `schemas/games/<game>/enums/`. Every Borderlands content record must use a local schema that adds the required release availability; reusing a shared record unchanged there would omit that requirement.

## Data model

Records hold their own metadata and refer to other records by stable IDs. Do not copy a referenced record's metadata into every record that uses it. ID fields do not resolve references automatically: validating their format and checking their targets exist are separate concerns.

Collections are objects keyed by record ID. Collection validation should check each record and ensure each key matches its record's `id`. Their property order is not a display-order contract.

A fixed identifier can be an enum without a corresponding metadata record. It can also have both: an element enum defines allowed IDs, while an element record adds its name, summary and description. The record's `id` uses that enum. A game-specific element schema narrows the ID to its supported subset and adds any local record requirements.

Human-readable labels and translations for enum values belong in consumers. Record content such as names, summaries and descriptions belongs in the data repository. Those values are distinct from schema `.describe()` instructions.

### Game membership

The assembled collection identifies a record's game. A record under `Data.Games["borderlands"].Records` belongs to Borderlands. The corresponding game-specific schema validates its shape; the schema's filesystem location alone does not establish membership.

Do not add a per-record `game`, `games` or duplicate game-ID field, or an enum for game membership. The database schema defines the supported game keys. The PascalCase `Games` container and game assembly schemas still exist. Cross-game references need explicit target context, not membership fields on every record.

Optional metadata at the game dataset root describes the title as a whole. It is separate from the content records inside its collections.

### Release availability

Borderlands distinguishes releases through its local `Release` enum: `standard`, `goty` and `goty-enhanced`. `standard` means the original release. Every Borderlands content record, including elements, enemies, items, locations and missions, requires a non-empty `releases` array containing every release in which it exists.

- Present in all three: `releases: ["standard", "goty", "goty-enhanced"]`.
- Enhanced only: `releases: ["goty-enhanced"]`.
- Missing or empty availability does not mean all releases. Do not default to all releases.
- Do not select only the oldest release or the release captured by an extraction. Establish availability for each listed release from evidence.
- Not finding a record in one source is not proof of absence. If complete availability is uncertain, flag the gap rather than present a partial list as exhaustive.
- Adding an enum value does not establish existing records' availability in that release.

Use `Release` and `releases` for edition availability. Do not use the retired game-prefixed release IDs or call editions schema/patch versions. Game membership, release availability, DLC/content membership and schema versions are distinct concepts.

Other games do not need a single-value `Release` enum or a placeholder `releases` field merely for symmetry. Add release availability only when a game module needs release-specific distinctions. Keep it out of the shared record foundation.

Descriptions must follow these boundaries. A shared description must not require release fields absent from its schema. A Borderlands record description must preserve relevant release guidance. Availability of an item family does not imply identical stats, parts or rolls in every listed release.

## Purpose of `.describe()`

The sole purpose of `.describe()` here is to help the downstream AI build the correct data object from evidence. Write it for that AI, not as API documentation, UI help text or commentary about the TypeScript implementation.

Explain what the root schema represents and how the builder should populate it. Include important field meanings or boundaries in that root description when needed. Add a short example only when it prevents a likely mistake. Usually one or two concise sentences are enough.

- Describe the actual schema and intended meaning. Do not invent fields, defaults or requirements.
- Put instructions at the correct level: an enum describes one value; an array describes the selection of values.
- Distinguish an ID enum from a metadata record even when both exports have the same name. Describe the actual target.
- Do not repeat obvious type information when the schema already supplies it.
- Use exact field names and enum values from the source. Do not translate stored IDs into display labels.
- Distinguish a known zero, false or empty value from missing evidence. Never use placeholders for unknown facts.
- Permit omission only where the schema allows it. If required information is unavailable, flag the gap rather than fabricate a valid-looking object.
- Keep facts in the fields that own them. Explain neighbouring fields only when it prevents a likely misclassification.
- Do not invent names, URLs, stats, drop chances or red text. Asset paths and localisation keys are not display names.
- Do not turn a single observed roll into a min/max range, or a loot-pool weight into a percentage.
- Keep evidence specific to the game, release and content involved. A page about another game is not evidence for this record.
- Where the schema represents an item family, do not treat every observed level, part combination or roll as a separate family.

Descriptions can explain semantic rules that need evidence or broader validation. They do not enforce those rules: use schema checks or relationship validation where appropriate. Do not change accepted data merely to make it match newly written prose.

When asked to improve a description, inspect the requested schema and its dependencies, then edit only that schema's root description. A description-only request does not authorise changes to field names, types, optionality, defaults or relationships. Ask when an unresolved ambiguity would change the data contract.

Keep schema-specific guidance in that schema's root `.describe()`. Keep this file focused on project-wide context. Do not inherit assumptions from the previous Borderlens catalogue or old extractor without checking they apply to this contract.

### Writing a description

1. Identify the requested export and whether it describes one value, a component, a record or a collection.
2. Read its source, referenced primitives/enums, base schema and existing description. Check any local restrictions.
3. Identify the decisions the builder needs help with: meaning, evidence, ambiguity, placement and permitted omission.
4. Reuse existing guidance when its meaning is unchanged; otherwise adapt or explicitly compose it.
5. Attach one description to the requested root. Check that the text matches the schema and project rules.

Prefer direct instructions such as “Use the existing location ID” or “List every release containing this record”. Avoid vague text such as “Location information”, implementation commentary such as “Extends the base schema”, and boilerplate warnings that add no useful decision guidance.

Do not prescribe Markdown, line breaks, ranges or other formats without checking the actual primitive and intended contract. A single-line summary is a brief overview; the optional content `description` is the longer explanation. The content field named `description` is distinct from Zod's schema `.description` metadata.

Keep shared descriptions applicable across their consumers. Do not put Borderlands-only mechanics in shared guidance. If the source and intended semantics conflict, flag the specific mismatch rather than quietly changing validation or inventing a rule. Uncertainty about game facts is not permission to guess.

### Description placement

Add `.describe()` only to the root of the schema being defined or edited, after its final schema-building operation. For an object schema, attach it to the complete object expression. Do not add descriptions to its individual properties, array elements or nested schemas, and do not recursively annotate its dependencies.

For example:

```ts
export const BaseRecord = z.object({
  summary: Primitives.String.Line,
  description: Primitives.String.Lines.optional(),
}).describe(
  "Provide a brief single-line overview. Add a longer explanation when supported by evidence."
);
```

This request gets one description on `BaseRecord`, not additional descriptions on `summary` or `description`. A separately defined reusable primitive, enum or component can have its own root description; referencing it inside an object does not authorise rewriting or adding descriptions there. Leave existing dependency descriptions untouched.

### Game-specific schemas

Everything under `schemas/games/<game>/` is scoped to that game, including its supported releases. These modules specialise the shared contract through allowed subsets, additional fields or game-specific constraints. They do not describe individual content records.

When writing a description here, inspect both the local schema and the shared definition it uses. Explain the meaning in this game's context, preserving any relevant shared guidance. Keep the final description understandable on its own; the builder may not receive the shared schema's description alongside it.

- Focus on game-specific terminology, value meanings and evidence requirements that help the builder choose correctly.
- Do not add “and no other game” or restate the allowed values solely to repeat a restriction already encoded by the schema.
- A game-specific enum still describes one value, not the containing record, array or complete game dataset.
- A game folder can cover several releases. For Borderlands content records, `releases` states availability explicitly; folder membership does not imply presence in every release.
- If the meaning is unchanged, reuse the shared description directly. Do not copy and paste it or invent a distinction just because the schema is game-specific.

### Reusing shared descriptions

Keep useful guidance attached to the final schema consumed by the builder. Do not assume `.extract()` or other schema-building methods preserve the shared description; explicitly reapply it where needed.

Descriptions do not merge automatically. Calling `.describe(...)` on a derived schema sets that schema's root description; it does not append the base schema's description. Descriptions on reused, unchanged property schemas remain separate from the object's root description. Replacing a property schema uses the replacement's metadata.

- Same meaning: reference the shared schema's `.description` rather than maintaining duplicate text.
- Game-specific meaning: write a local description that preserves relevant shared guidance.
- Shared wording mentions unsupported values or rules: adapt it to the local schema instead of reusing it unchanged.

If both base and local guidance are needed, explicitly compose the base `.description` with the additional text, or write one complete description. Do not concatenate unrelated guidance merely because one schema extends another. Attach the result only to the derived schema's root.

For example, in a game's enum file when the shared guidance applies unchanged:

```ts
import { Element as SharedElement } from "../../../shared/enums/element.schema.js";

export const Element = SharedElement.extract([
  "corrosive",
  "incendiary",
  "shock",
]).describe(SharedElement.description!);
```

The non-null assertion assumes the shared enum has a description. Check that it does before using this pattern. Do not invent fallback text to hide missing guidance. Use the actual game's supported values; the example only illustrates description reuse.

Do not concatenate the same base guidance more than once through an extension chain. When inherited text conflicts with the local contract, replace or adapt it rather than appending a contradictory exception. Never describe a derived object by merely repeating its enum's description: the record and the ID have different meanings.

## Editing scope

For a requested code edit, save the description in the schema file and report the change briefly. For a wording review or question, answer that request without changing files unless asked.

Limit description-only edits to the requested root `.describe()` text and directly necessary formatting or description reuse. Do not add descriptions to every export, change validation, rename fields, refactor imports or introduce helpers as incidental cleanup. If existing code still uses the retired game-membership model, identify the mismatch; do not migrate its data contract under a description-only request.

## Code conventions

- Use PascalCase for project-owned declarations, including schemas, exports, functions, types, parameters and local variables.
- Keep individual record fields camelCase. Use PascalCase for namespace containers in assembled data.
- Keep IDs and slug-like enum values kebab-case. Use lowercase/kebab-case filenames.
- Use singular `*.schema.ts` filenames and `*.base.schema.ts` for foundations, such as `item.base.schema.ts`.
- Keep an `index.ts` barrel in each source folder. Use direct imports internally to avoid circular barrel dependencies.
- Infer types from Zod schemas. Preserve the public `/schemas` and `/types` boundaries.
- Use British English and 2-space indentation. Keep code lines within 120 characters where practical.

Follow the existing source and package scripts for implementation and verification. Do not assume that a helper, validator or example described in the architecture guide has already been implemented.
