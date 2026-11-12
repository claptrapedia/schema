# Borderlands schema package structure

This repository contains Zod 4 schema definitions, validation logic and inferred TypeScript types for a Borderlands database covering the series. Publish it as an npm package with two public entry points: `/schemas` and `/types`.

Use a flat layout within the shared and game-specific category folders. Keep related schema variants together in the same `*.schema.ts` file. Barrels provide namespaces such as `Shared.Primitives.Id` and `Shared.Records.Enemies.Boss`, independently of the physical folder depth.

> [!IMPORTANT]
> Production content belongs in a separate data repository. Schema files define what records look like; they do not contain individual bosses, weapons, locations or their descriptions.

## Table of contents

- [Structure](#structure)
- [Organisation and naming](#organisation-and-naming)
- [Source entry point](#source-entry-point)
- [Schemas](#schemas)
  - [Database](#database)
  - [Index](#index)
  - [Shared](#shared)
  - [Primitives](#primitives)
  - [Enums](#enums)
  - [Utils](#utils)
  - [Components](#components)
  - [Records](#records)
  - [Games](#games)
- [Validation](#validation)
- [Types](#types)
- [Package exports](#package-exports)
- [Data repository boundary](#data-repository-boundary)
- [Dependency direction](#dependency-direction)

## Structure

This tree shows representative files only. Other games follow the same pattern; only `borderlands/` and `borderlands-2/` are shown. Files are listed first and strictly alphabetically within each folder, including `index.ts`. Folders then follow a logical order: shared foundations before game-specific definitions, and schemas before validation and types. The source chapters below follow this organisation, with supporting guidance afterwards.

```text
src/
├── index.ts
│
├── schemas/
│   ├── database.schema.ts
│   ├── index.ts
│   │
│   ├── shared/
│   │   ├── index.ts
│   │   ├── primitives/
│   │   │   ├── id.schema.ts
│   │   │   ├── index.ts
│   │   │   └── text.schema.ts
│   │   ├── enums/
│   │   │   ├── index.ts
│   │   │   ├── item-kind.schema.ts
│   │   │   └── weapon-type.schema.ts
│   │   ├── utils/
│   │   │   ├── collection.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── image.schema.ts
│   │   │   ├── index.ts
│   │   │   └── stat.schema.ts
│   │   └── records/
│   │       ├── enemy.schema.ts
│   │       ├── game.schema.ts
│   │       ├── index.ts
│   │       ├── item.base.schema.ts
│   │       ├── item.schema.ts
│   │       ├── location.schema.ts
│   │       ├── mission.schema.ts
│   │       └── record.base.schema.ts
│   │
│   └── games/
│       ├── index.ts
│       ├── borderlands/
│       │   ├── game.schema.ts
│       │   ├── index.ts
│       │   ├── relationships.ts
│       │   ├── enums/
│       │   │   ├── index.ts
│       │   │   ├── release.schema.ts
│       │   │   └── weapon-type.schema.ts
│       │   └── records/
│       │       ├── enemy.schema.ts
│       │       ├── index.ts
│       │       ├── item.schema.ts
│       │       ├── mission.schema.ts
│       │       └── record.base.schema.ts
│       └── borderlands-2/
│           ├── game.schema.ts
│           ├── index.ts
│           ├── relationships.ts
│           ├── enums/
│           │   ├── index.ts
│           │   └── weapon-type.schema.ts
│           └── records/
│               ├── enemy.schema.ts
│               ├── index.ts
│               └── item.schema.ts
│
├── validation/
│   ├── index.ts
│   ├── validate-database.ts
│   └── validate-relationships.ts
│
└── types/
    ├── database.types.ts
    ├── index.ts
    │
    └── games/
        ├── borderlands.types.ts
        └── index.ts
```

Additional definitions, such as character classes, manufacturers and rarities, become files in the appropriate category. They do not each require a new folder.

## Organisation and naming

Keep the meaningful group folders, ordered by purpose rather than alphabetically. Under `schemas/`, put `shared/` before `games/`. Under `shared/`, use `primitives/`, `enums/`, `utils/`, `components/` and `records/`. Keep files alphabetically ordered within every folder. Inside each category, use loose files rather than a folder and barrel for every concept. Every remaining source folder has an `index.ts` barrel.

Group related siblings in one schema file where practical. For example, `enemy.schema.ts` exports `Base`, `Boss`, `Named` and `Standard`. Multiple exports do not require multiple files or folders. Substantial definitions can be split into additional descriptively named files without changing the public namespace.

Use singular schema filenames such as `enemy.schema.ts`, `mission.schema.ts` and `weapon-type.schema.ts`. Use `*.base.schema.ts` for a foundation, with the concept first: `item.base.schema.ts` and `record.base.schema.ts`. These sort beside the definitions they support. Keep explicit internal names such as `BaseItemSchema` and `BaseRecordSchema`.

Utility functions use ordinary `.ts` filenames, such as `collection.ts`, because they build schemas rather than define one particular schema.

Use PascalCase consistently for all project-owned declarations: namespace exports, Zod schema constants, helpers, functions, parameters, local variables and inferred types. Examples include `Shared`, `WeaponType`, `CreateCollectionSchema`, `ParseDatabase`, `Input` and `Data`. This is a project convention, not a requirement imposed by Zod.

Use PascalCase for namespace containers and collection names in assembled data too: `Games`, `Records`, `Enemies`, `Bosses`, `Items`, `Weapons` and `Locations`. Relationship paths must use the exact same casing.

Individual record fields remain camelCase, such as `id`, `locationIds`, `releases` and `weaponType`. IDs and slug-like enum values remain kebab-case, such as `"borderlands-2"`, `"bone-head"` and `"assault-rifle"`. Collection keys are IDs, not namespace names.

Folders and filenames remain lowercase/kebab-case. Third-party bindings and APIs retain their existing spelling, including Zod's `z`, `.object()`, `.record()` and `.parse()`. The PascalCase convention applies to names owned by this package.

## Source entry point

`src/index.ts` is the internal root barrel. The public npm entry points remain `/schemas` and `/types`; the root barrel does not require a public package-root import.

## Schemas

The following sections follow `schemas/`: its alphabetically ordered database schema and entry barrel, then shared foundations and game-specific modules. Shared category sections follow the folder order in the tree. Examples illustrate organisation rather than a complete field specification. Imports are omitted unless their paths or aliases are being demonstrated.

### Database

`schemas/database.schema.ts` assembles the supported games:

```ts
export const DatabaseSchema = z.object({
  Games: z.strictObject({
    "borderlands": BorderlandsGame,
    "borderlands-2": Borderlands2Game,
  }),
});
```

`BorderlandsGame` and `Borderlands2Game` are direct import aliases for each game's `Game` export. This example requires both illustrated games and rejects unrecognised game keys. Add the other supported games using the same pattern; partial datasets require an explicit schema decision.

The assembled data retains its domain grouping even though the schema files are flat:

```ts
const Data = ParseDatabase(Input);

Data.Games["borderlands"].Records.Enemies.Bosses["bone-head"];
Data.Games["borderlands-2"].Records.Items.Weapons["conference-call"];
```

The game and record keys remain their stable IDs. A flat source layout does not flatten the data model or remove its relationships.

#### Game membership

A record belongs to the game collection containing it. For example, `Data.Games["borderlands"].Records.Items.Weapons` contains Borderlands weapons. The database schema selects the correct game-specific schema for that collection.

Do not repeat this membership in a per-record `game`, `games` or game-ID field. No shared or game-specific game enum is required: the database schema defines the supported game keys directly. The PascalCase `Games` container remains part of the assembled data.

A schema's filesystem location alone does not establish membership. The assembled data location supplies the game context, and the schema validates the records placed there.

Release availability is separate. Borderlands distinguishes `standard`, `goty` and `goty-enhanced` through a local `Release` enum and a required `releases` array on every Borderlands content record. Other game modules only introduce release availability when they need that distinction.

### Index

`schemas/index.ts` defines the public runtime surface:

```ts
export { DatabaseSchema as Database } from "./database.schema.js";
export * as Games from "./games/index.js";
export { ParseDatabase } from "../validation/validate-database.js";
export * as Shared from "./shared/index.js";
```

Flat files can still provide nested namespaces. For example:

```ts
// shared/records/index.ts
export { BaseRecordSchema as Base } from "./record.base.schema.js";
export * as Enemies from "./enemy.schema.js";
export * as Games from "./game.schema.js";
export * as Items from "./item.schema.js";
export * as Locations from "./location.schema.js";
export * as Missions from "./mission.schema.js";
```

This preserves `Shared.Records.Enemies.Boss` without an `enemies/` folder or a separate enemy barrel. The same rule applies to game-specific record barrels.

> [!TIP]
> Use explicit exports and direct imports between implementation files. Importing an implementation's own parent namespace can introduce circular dependencies. Barrels organise the consumer API; they do not contain validation logic.

### Shared

`schemas/shared/` contains its barrel followed by flat category folders in logical order: `primitives/`, `enums/`, `utils/`, `components/` and `records/`. Files inside each category remain strictly alphabetical.

The shared barrel exposes the same concise public namespaces:

```ts
export * as Components from "./components/index.js";
export * as Enums from "./enums/index.js";
export * as Primitives from "./primitives/index.js";
export * as Records from "./records/index.js";
export * as Utils from "./utils/index.js";
```

Schema namespaces follow the exports, not the number of source folders. No TypeScript `namespace` declarations are needed.

### Primitives

`shared/primitives/` contains loose field-validator files such as `id.schema.ts` and `text.schema.ts`.

#### ID

```ts
// shared/primitives/id.schema.ts
export const IdSchema = z.stringFormat(
  "id",
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
);
```

A valid ID format does not establish that a referenced record exists. The primitive barrel exports it directly as `Id`, preserving `Shared.Primitives.Id`.

#### Text

```ts
// shared/primitives/text.schema.ts
export const RequiredTextSchema = z.string().trim().nonempty();
```

The same barrel can expose this as `Shared.Primitives.RequiredText`. Other primitive definitions follow the same flat file pattern.

### Enums

`shared/enums/` contains loose enum files. A game's `enums/` folder uses the same arrangement for its allowed subsets.

#### Item kind

`item-kind.schema.ts` defines fixed structural choices:

```ts
export const ItemKindSchema = z.enum([
  "artifact",
  "shield",
  "weapon",
]);
```

#### Weapon type

`weapon-type.schema.ts` defines the combined set of supported values across games:

```ts
export const WeaponType = z.enum([
  "assault-rifle",
  "combat-rifle",
  "repeater",
  "shotgun",
]);
```

These abbreviated lists illustrate the architecture; they are not exhaustive weapon classifications. Each game extracts its supported subset, as shown in the game module example.

> [!TIP]
> Prefer `.extract()` over `.exclude()` for game-specific subsets: adding a shared value must not silently make it valid in every game.

The shared enum barrel exports values directly:

```ts
export { ItemKindSchema as ItemKind } from "./item-kind.schema.js";
export { WeaponType } from "./weapon-type.schema.js";
```

This preserves `Shared.Enums.WeaponType` and `Games.Borderlands.Enums.WeaponType`. Open-ended content such as bosses does not need an enum duplicating its record IDs. Fixed vocabularies such as elements can have both an ID enum and a metadata record schema whose `id` uses that enum.

There is no game-membership enum. Release enums belong to the game modules that need them; Borderlands defines its own `Release` rather than extracting editions from a shared list of games.

#### Display labels

Human-readable labels for enum values belong in the consuming UI's translation dictionaries, outside this schema package. Data stores the stable identifier; the UI chooses the wording and language.

```json
{
  "assault-rifle": "Assault rifle",
  "combat-rifle": "Combat rifle",
  "shotgun": "Shotgun"
}
```

Use deliberate labels rather than automatically capitalising slugs, especially for abbreviations and game-specific terminology. This applies to enum labels; content metadata such as a boss's name, summary and description remains in the data repository.

### Utils

`shared/utils/` contains loose generic helper files. The collection factory lives in `collection.ts`, not in primitives or a dedicated concept folder.

#### Collections

The helper takes a schema for one record and returns a schema for an ID-keyed collection of those records:

```ts
export function CreateCollectionSchema<T extends z.ZodType<{ id: string }>>(
  RecordSchema: T,
) {
  return z.record(IdSchema, RecordSchema).refine(
    (Records) => Object.entries(Records).every(([Key, Record]) => Key === Record.id),
    { error: "Collection keys must match record IDs" },
  );
}
```

The utility barrel exports the function directly from `./collection.js`, preserving `Shared.Utils.CreateCollectionSchema`.

```ts
const BossCollection = Shared.Utils.CreateCollectionSchema(Shared.Records.Enemies.Boss);
const ShieldCollection = Shared.Utils.CreateCollectionSchema(Shared.Records.Items.Shield);
const WeaponCollection = Shared.Utils.CreateCollectionSchema(Shared.Records.Items.Weapon);

BossCollection.parse(Bosses);
```

It works with any record shape containing an `id`. The data code assembles the keyed object; the helper validates the object, each record and every key/ID match. It does not assemble records, load content or resolve references.

### Components

`shared/components/` contains loose files for embedded structures such as images, acquisition details, effects and stats.

#### Images

`image.schema.ts` defines embedded image details, such as a filename and alternative text. Related image variants can share the same file. Its namespace can be exposed as:

```ts
export * as Images from "./image.schema.js";
```

#### Stats

`stat.schema.ts` groups related stat shapes:

```ts
export const Range = z.tuple([z.number(), z.number()])
  .refine(([Min, Max]) => Min <= Max, {
    error: "Minimum must not exceed maximum",
  });

export const Weapon = z.object({
  damage: Range,
  fireRate: Range,
});
```

The component barrel exposes `Stats` from this file, preserving `Shared.Components.Stats.Range` and `Shared.Components.Stats.Weapon`.

### Records

`shared/records/` contains loose schema files for independently identified records. Game-specific `records/` folders follow the same arrangement. The examples below follow the alphabetical order of the shared record files.

#### Enemies

Keep the related enemy shapes in `enemy.schema.ts`:

```ts
export const Base = BaseRecordSchema.extend({
  isBoss: z.boolean(),
  isNamed: z.boolean(),
  locationIds: z.array(IdSchema),
});

export const Boss = Base.extend({
  isBoss: z.literal(true),
});

export const Named = Base.extend({
  isNamed: z.literal(true),
});

export const Standard = Base.extend({
  isBoss: z.literal(false),
  isNamed: z.literal(false),
});
```

`Base` supplies the common shape; it is not an ordinary-enemy classification. `Standard` is an ordinary enemy that is neither named nor a boss. `Named` and `Boss` can overlap, so a boss can also be named. The flags are illustrative; the exact fields remain a data-model decision.

The record barrel exposes this module as `Enemies`, providing `.Base`, `.Boss`, `.Named` and `.Standard` without extra source folders.

#### Game metadata

`game.schema.ts` can export `Metadata`, based on `BaseRecordSchema`, if the dataset includes title metadata such as a name and summary. This is an optional metadata shape, not a game-membership enum. The game module's assembly schema adds that game's collections.

The assembled game's metadata describes the title as a whole. It is separate from the content records inside its collections, where release availability is recorded.

#### Item base

`item.base.schema.ts` defines the shared item foundation:

```ts
export const BaseItemSchema = BaseRecordSchema.extend({
  kind: ItemKindSchema,
});
```

Its filename keeps it beside `item.schema.ts`. Keep the exported identifier explicit as `BaseItemSchema`.

#### Items

`item.schema.ts` groups related item variants:

```ts
import { BaseItemSchema } from "./item.base.schema.js";

export { BaseItemSchema as Base } from "./item.base.schema.js";

export const Weapon = BaseItemSchema.extend({
  kind: z.literal("weapon"),
  stats: WeaponStatsSchema,
});
```

`WeaponStatsSchema` is a direct import alias for `Weapon` from `components/stat.schema.ts`. The namespace `Shared.Records.Items` can expose `Base`, `Weapon`, `Shield` and `Artifact` from this module. Related variants stay together where practical; game-specific item files may also export an aggregate union.

#### Locations

`location.schema.ts` defines the location record shape and metadata. Its containing game collection supplies game membership. Other records reference location IDs, rather than copying the location's content.

#### Missions

`mission.schema.ts` defines mission records and their game-specific extensions. It remains one file until the implementation warrants splitting related definitions into additional files.

#### Record base

`record.base.schema.ts` supplies the common record foundation:

```ts
export const BaseRecordSchema = z.object({
  description: RequiredTextSchema,
  id: IdSchema,
  name: RequiredTextSchema,
  summary: RequiredTextSchema,
});
```

The record barrel can expose it as `Shared.Records.Base`. Its filename distinguishes it from the item foundation while retaining the `*.base.schema.ts` convention.

Keep game membership and release availability out of this shared foundation. The containing data collection identifies the game; game-specific schemas add release fields when that game distinguishes releases.

### Games

`schemas/games/` contains its barrel followed by the individual game modules. Each game has its own flat `enums/` and `records/` categories, plus alphabetically ordered assembly, barrel and relationship files.

#### Games barrel

`schemas/games/index.ts` exposes game modules in alphabetical order:

```ts
export * as Borderlands from "./borderlands/index.js";
export * as Borderlands2 from "./borderlands-2/index.js";
```

#### Borderlands

Within `games/borderlands/`, files appear alphabetically as `game.schema.ts`, `index.ts` and `relationships.ts`, followed by the logical folder order `enums/` then `records/`. The sections below follow that same order.

##### Game schema

`game.schema.ts` assembles the game metadata and record collections:

```ts
export const Game = GameMetadataSchema.extend({
  id: z.literal("borderlands"),
  Records: z.object({
    Enemies: z.object({
      Bosses: CreateCollectionSchema(BorderlandsBoss),
    }),
    Items: z.object({
      Weapons: CreateCollectionSchema(BorderlandsWeapon),
    }),
    Locations: CreateCollectionSchema(BorderlandsLocation),
  }),
});
```

The names are direct import aliases for the shared metadata and concrete game-specific schemas. The shortened example shows a few collections; other collections follow the same pattern.

The top-level metadata ID identifies the title itself. It is not repeated on every content record. A dataset without title metadata can assemble `Records` in a plain object schema instead.

Use the local schemas for every Borderlands content collection, including elements, locations and missions. Reusing a shared schema directly here would bypass the required release availability added by the local records.

Each content record should have one canonical storage location. Do not duplicate a boss's metadata merely because it also satisfies a named-enemy schema.

##### Game barrel

`index.ts` exposes the game's namespaces and assembly schema:

```ts
export * as Enums from "./enums/index.js";
export { Game } from "./game.schema.js";
export * as Records from "./records/index.js";
```

##### Relationship declarations

`relationships.ts` declares how the game's record collections refer to each other. The central validation module checks these declarations against the assembled data, as described under Validation.

##### Local enums

Files in `enums/` appear alphabetically: `index.ts`, `release.schema.ts` and `weapon-type.schema.ts`.

`enums/release.schema.ts` defines editions of the first Borderlands game:

```ts
export const Release = z.enum([
  "standard",
  "goty",
  "goty-enhanced",
]);
```

These values are scoped to the containing Borderlands dataset. `standard` means the original release. Use `Release` and `releases` for edition availability, keeping `Version` available for concepts such as patch or schema versions. DLC/content membership is a separate concern.

`enums/weapon-type.schema.ts` selects the game's supported values from the shared enum:

```ts
export const WeaponType = SharedWeaponType.extract([
  "combat-rifle",
  "repeater",
  "shotgun",
]);
```

`SharedWeaponType` is a direct import alias for the shared enum. The game's enum barrel exposes `Release` and `WeaponType` as `Games.Borderlands.Enums.Release` and `Games.Borderlands.Enums.WeaponType`.

##### Local records

The local record files follow their alphabetical order. `records/enemy.schema.ts` specialises the shared enemy exports and adds the common Borderlands release fields:

```ts
import { ReleaseFields } from "./record.base.schema.js";

export const Base = SharedBase.extend(ReleaseFields);
export const Boss = SharedBoss.extend(ReleaseFields);
export const Named = SharedNamed.extend(ReleaseFields);
export const Standard = SharedStandard.extend(ReleaseFields);
```

The `Shared...` names are direct import aliases from the shared enemy schema file. `ReleaseFields` is exported by the local record foundation below. Add other game-specific attributes and restrictions here. Individual enemies remain data records, not separate schema files.

`records/item.schema.ts` uses the local enum when validating a weapon:

```ts
import { ReleaseFields } from "./record.base.schema.js";

export const Weapon = SharedWeapon.extend({
  ...ReleaseFields,
  weaponType: WeaponType,
});
```

`SharedWeapon` is imported from the shared item schema file; `WeaponType` comes from this game's `enums/weapon-type.schema.ts`. The complete game schema must use the specialised `Weapon` export so unsupported types are rejected.

`records/mission.schema.ts` and the other local record schemas apply the same release fields, plus any restrictions relevant to their record type. A local element schema also narrows `id` to the game's element enum; its metadata record still requires release availability.

`records/record.base.schema.ts` defines the Borderlands record foundation:

```ts
import { BaseRecordSchema as SharedBaseRecordSchema } from "../../../shared/records/record.base.schema.js";
import { Release } from "../enums/release.schema.js";

export const BaseRecordSchema = SharedBaseRecordSchema.extend({
  releases: z.array(Release).min(1),
});

export const ReleaseFields = BaseRecordSchema.pick({ releases: true }).shape;
```

New local record types can extend `BaseRecordSchema` directly. Existing shared specialisations use `.extend(ReleaseFields)` to add availability without replacing their constrained IDs, fields or discriminators. Do not spread the entire base shape over a specialised record.

Every Borderlands content record requires at least one explicit release. This applies even to records present in all three releases, such as the currently supported elements:

```json
{
  "releases": ["standard", "goty", "goty-enhanced"]
}
```

A record exclusive to Enhanced instead contains:

```json
{
  "releases": ["goty-enhanced"]
}
```

These snippets show only the availability field, not complete records. Missing or empty availability does not mean “all releases”; do not default to all releases either. A new release must be added to existing records only when its availability is established. Availability on an item family means the family exists in those releases, not that every stat or roll is identical across them.

#### Borderlands 2

`games/borderlands-2/` follows the same flat arrangement. Its enums select its own supported values, and its record schemas apply its own fields and restrictions. Reuse shared definitions when no specialisation is required.

Do not introduce a single-value `Release` enum containing only `standard`, or a placeholder `releases` field, merely to mirror Borderlands. The same applies to TPS and the other games. Introduce release availability in a game module only when its data needs release-specific distinctions. Consistency comes from applying this rule, not requiring identical fields in every game.

## Validation

`validation/` contains its barrel followed alphabetically by the database and relationship validators.

#### Database validation

`validate-database.ts` exposes complete validation:

```ts
export function ParseDatabase(Input: unknown) {
  const Data = DatabaseSchema.parse(Input);
  ValidateRelationships(Data);
  return Data;
}
```

#### Relationship validation

`validate-relationships.ts` interprets each game's relationship declarations. An `*Id` suffix does not automatically create a foreign key: record schemas validate shape, while this validator checks references.

A game can declare the following in `relationships.ts`:

```ts
export const Relationships = [
  {
    field: "locationIds",
    many: true,
    source: ["Records", "Enemies", "Bosses"],
    target: ["Records", "Locations"],
  },
] as const;
```

This is a proposed package-owned descriptor format, with paths relative to the containing game. The validator must implement its interpretation; declaring descriptors alone does not run any checks.

```ts
const Game = Data.Games["borderlands"];
const Bosses = Game.Records.Enemies.Bosses;
const Locations = Game.Records.Locations;
```

> [!NOTE]
> The source and target arrays navigate exact keys in the assembled data, not filesystem paths or schema modules. Namespace containers are PascalCase; `field: "locationIds"` keeps the record property's camelCase spelling.

Check that referenced IDs exist and every element of an ID array resolves within the containing game's collections. Optional references are checked when present. Cross-game references need an explicit target game, validated against the database's supported game keys; this does not require a per-record game-membership field or a separate game enum.

Each collection must use its corresponding game-specific record schema. For Borderlands, those schemas require a non-empty `releases` array restricted to the local `Release` enum. This validates the availability declaration, not the underlying evidence that a record actually exists in a release.

Errors should identify the source game, collection, record, field and target. Validating one record in isolation cannot establish referential integrity without the relevant collections.

## Types

`types/` contains types inferred from schemas, without maintaining duplicate interfaces. Its files appear alphabetically as `database.types.ts` then `index.ts`, followed by the `games/` folder.

```ts
// types/games/borderlands.types.ts
import type { z } from "zod";
import type { Boss } from "../../schemas/games/borderlands/records/enemy.schema.js";

export type BorderlandsBoss = z.infer<typeof Boss>;
```

Use type-only exports throughout the `/types` entry point. Keep an `index.ts` in every remaining type folder. Shared types can be grouped in additional loose files by domain.

## Package exports

The public entry points remain `/schemas` and `/types`:

```ts
import { Database, Games, ParseDatabase, Shared } from "@your-scope/borderlands/schemas";
import type { BorderlandsBoss } from "@your-scope/borderlands/types";
```

> [!IMPORTANT]
> `Database.parse` validates the assembled structure and collection rules. `ParseDatabase` also runs relationship validation.

The package name is illustrative. For an ESM build preserving the source directories:

```json
{
  "type": "module",
  "files": ["dist"],
  "exports": {
    "./schemas": {
      "types": "./dist/schemas/index.d.ts",
      "import": "./dist/schemas/index.js"
    },
    "./types": {
      "types": "./dist/types/index.d.ts"
    }
  }
}
```

Configure the build to emit JavaScript and declarations into that layout. The internal root barrel does not introduce a public package-root import.

## Data repository boundary

Actual content belongs in the separate data repository. Its loading strategy and physical file layout can differ from the schema package. For example:

```text
data-repo/
└── borderlands/
    ├── game.data.ts
    └── records/
        ├── enemies/
        │   └── bosses/
        │       └── bone-head.data.ts
        └── items/
            └── weapons/
                └── hellfire.data.ts
```

The `.data.ts` suffix is illustrative, not a settled requirement. JSON and separate Markdown descriptions can also be used. The importer assembles the nested collections and calls `ParseDatabase`.

Game membership comes from the assembled game collection, regardless of the source files' physical layout. Do not put a `games` array or a duplicate game-ID field on each record. Borderlands records additionally declare `releases`; the other game modules omit that field until they need release-specific availability.

Neither JSON nor an ID string resolves another record automatically. The consuming code performs those lookups. IDs are unique within their collection; references across games or collections include enough context to identify the target. Sort explicitly or use a `sortOrder` field when display order matters.

## Dependency direction

Folder listings and source chapters follow the logical organisation shown in the tree; files remain alphabetical within every folder. Implementation dependencies follow their logical direction:

1. Primitives and enums.
2. Components and record foundations.
3. Shared record schemas and generic helpers.
4. Game-specific enums and record schemas.
5. Complete game schemas.
6. Database assembly and relationship validation.

Infer types from these schemas. Shared definitions do not import game-specific modules, and implementation files import direct dependencies rather than their own parent barrels.
