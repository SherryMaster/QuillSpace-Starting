import { BaseBlockProps } from "@/components/contentblock/ContentBlock";

export interface GlossaryEntry {
  term: string;
  definition: string;
  category?: string;
  tags?: string[];
}

export interface GlossaryBlockProps extends BaseBlockProps {
  type: "Glossary";
  dictionary: Record<
    string,
    | string
    | {
        definition: string;
        category?: string;
        tags?: string[];
      }
  >;
  layout?: "grid" | "list" | "cards";
  searchPlaceholder?: string;
  initialSort?: "asc" | "desc";
  showCategories?: boolean;
  showTags?: boolean;
  itemClassName?: string;
  termClassName?: string;
  definitionClassName?: string;
  searchBarPosition?: "top" | "sticky";
  animateEntries?: boolean;
  groupByCategory?: boolean;
}
