import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Cache the search index forever for static export
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source);
