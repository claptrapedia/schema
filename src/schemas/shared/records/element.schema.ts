import { Element as Enum } from "#shared/enums/index.js";
import { BaseItem } from "#shared/records/item.base.schema.js";

export const Element = BaseItem.extend({
  id: Enum,
}).describe(`${BaseItem.description!} This is the metadata record for one element. id is that element's identifier, not the list of elements an item can spawn with.`);