import React from 'react';
import { useState, useMemo, ChangeEvent } from 'react';
import { Search, SortAsc, SortDesc, FolderIcon, TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/common';
import { GlossaryBlockProps, GlossaryEntry } from '@/types/glossary';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to highlight search terms
const highlightText = (text: string, searchQuery: string): string | React.ReactNode => {
  if (!searchQuery) return text;
  
  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === searchQuery.toLowerCase() 
      ? <mark key={i}>{part}</mark>
      : part
  );
};

export function GlossaryBlock({ 
  dictionary,
  layout = 'grid',
  searchPlaceholder = "Search terms or definitions...",
  initialSort = 'asc',
  showCategories = false,
  showTags = false,
  itemClassName,
  termClassName,
  definitionClassName,
  searchBarPosition = 'top',
  animateEntries = true,
  groupByCategory = false,
}: GlossaryBlockProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSort);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Convert dictionary to normalized format
  const entries = useMemo(() => {
    return Object.entries(dictionary).map(([term, definition]) => ({
      term,
      definition: typeof definition === 'string' ? definition : definition.definition,
      category: typeof definition === 'string' ? undefined : definition.category,
      tags: typeof definition === 'string' ? undefined : definition.tags,
    }));
  }, [dictionary]);

  // Get unique categories and tags
  const categories = useMemo(() => {
    return Array.from(new Set(
      entries
        .map(e => e.category)
        .filter((category): category is string => category !== undefined && category !== null)
    ));
  }, [entries]);

  // Get unique tags
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags?.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [entries]);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    // Create a new copy of the entries array to avoid mutation
    let result = [...entries];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(({ term, definition }) => 
        term.toLowerCase().includes(query) || 
        definition.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      result = result.filter(entry => entry.category === selectedCategory);
    }

    if (selectedTags.size > 0) {
      result = result.filter(entry => 
        entry.tags?.some((tag: string) => selectedTags.has(tag))
      );
    }

    // Always apply sorting regardless of filters
    return result.sort((a, b) => {
      const comparison = a.term.toLowerCase().localeCompare(b.term.toLowerCase());
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [entries, searchQuery, sortDirection, selectedCategory, selectedTags]);

  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  // Group entries by category if needed
  const groupedEntries = useMemo(() => {
    if (!groupByCategory) return { undefined: filteredEntries };
    
    return filteredEntries.reduce((acc, entry) => {
      const category = entry.category || 'Uncategorized';
      acc[category] = acc[category] || [];
      acc[category].push(entry);
      return acc;
    }, {} as Record<string, GlossaryEntry[]>);
  }, [filteredEntries, groupByCategory]);

  const renderGlossaryItem = (entry: GlossaryEntry) => (
    <motion.div
      layout={animateEntries}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "group transition-all duration-200",
        layout === 'grid' && "grid grid-cols-[1fr,2fr] gap-6 items-start",
        layout === 'list' && "flex flex-col gap-2 border-b border-border pb-4",
        layout === 'cards' && "bg-card rounded-lg shadow-sm hover:shadow-md p-6",
        "hover:bg-muted/50",
        itemClassName
      )}
    >
      <div className={cn(
        layout === 'grid' && "font-medium sticky top-0",
        layout === 'list' && "font-medium text-lg",
        layout === 'cards' && "text-lg font-medium mb-3",
        termClassName
      )}>
        {highlightText(entry.term, searchQuery)}
        {entry.tags && showTags && (
          <div className={cn(
            "flex flex-wrap gap-1.5",
            layout === 'grid' && "mt-2",
            layout === 'list' && "mt-1",
            layout === 'cards' && "mt-2"
          )}>
            {entry.tags.map(tag => (
              <span key={tag} className="text-xs bg-muted rounded-full px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={cn(
        "prose-sm",
        layout === 'grid' && "pt-0",
        layout === 'list' && "ml-4",
        layout === 'cards' && "mt-3",
        definitionClassName
      )}>
        {highlightText(entry.definition, searchQuery)}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      <div className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        searchBarPosition === 'sticky' && [
          "sticky z-40 py-4",
          // Account for navbar height (64px) plus some spacing
          "top-[55px]"
        ]
      )}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-10"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="hover:bg-transparent"
          title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>

      {(showCategories && categories.length > 0) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-lg",
                  selectedCategory === category 
                    ? "bg-primary/90 text-primary-foreground" 
                    : "hover:bg-primary/10 hover:text-primary"
                )}
                onClick={() => setSelectedCategory(
                  selectedCategory === category ? null : category
                )}
              >
                <FolderIcon className="w-4 h-4 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {(showTags && tags.length > 0) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.has(tag) ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full",
                  selectedTags.has(tag)
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-secondary/10 hover:text-secondary"
                )}
                onClick={() => handleTagClick(tag)}
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {Object.entries(groupedEntries).map(([category, entries]) => (
          <div key={category} className="space-y-4">
            {groupByCategory && (
              <h3 className="text-lg font-semibold">{category}</h3>
            )}
            <div className={cn(
              "divide-y divide-border rounded-lg border",
              layout === 'grid' && "grid gap-6 p-6 divide-y-0",
              layout === 'cards' && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 divide-y-0",
              layout === 'list' && "flex flex-col divide-y p-6"
            )}>
              {entries.map((entry: GlossaryEntry, index: number) => (
                <div key={index} className={cn(
                  layout === 'grid' && "p-0",
                  layout === 'cards' && "p-0",
                  layout === 'list' && "py-4 first:pt-0 last:pb-0"
                )}>
                  {renderGlossaryItem(entry)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </AnimatePresence>

      {filteredEntries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground"
        >
          No matching terms found
        </motion.div>
      )}
    </div>
  );
}
