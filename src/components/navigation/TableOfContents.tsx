import { useState, useEffect, useContext } from "react";
import { ChevronDown, ChevronRight, X, Box, LucideIcon } from "lucide-react";
import { ExpandedContext } from "@/contexts/ExpandedContext";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import { cn } from "@/utils/common";
import * as lucideIcons from 'lucide-react';
import { MediaType } from "@/types/media";
import { mediaTypeConfig } from '@/components/contentblock/ContentBlock';

interface TOCItem {
  id: string;
  title: string;
  type: string;
  iconName: string;
  iconColor: string;
  children: TOCItem[];
}

interface TableOfContentsProps {
  className?: string;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Add this utility function at the top of the file
const isElementInMiddleOfViewport = (element: Element): number => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementCenter = rect.top + (rect.height / 2);
  const viewportCenter = windowHeight / 2;
  
  // Return the absolute distance from the viewport center
  return Math.abs(elementCenter - viewportCenter);
};

// New helper function to check if element intersects with middle zone
const intersectsMiddleZone = (rect: DOMRect): boolean => {
  const windowHeight = window.innerHeight;
  const middleZoneSize = windowHeight * 0.1; // 10% of viewport height
  const middleZoneTop = (windowHeight / 2) - (middleZoneSize / 2);
  const middleZoneBottom = middleZoneTop + middleZoneSize;

  // Check if the element intersects with the middle zone
  return rect.bottom > middleZoneTop && rect.top < middleZoneBottom;
};

// New helper function to get block depth
const getBlockDepth = (element: Element): number => {
  let depth = 0;
  let current = element;
  while (current.parentElement) {
    if (current.parentElement.classList.contains('content-block')) {
      depth++;
    }
    current = current.parentElement;
  }
  return depth;
};

export function TableOfContents({ className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { setExpandedBlocks } = useContext(ExpandedContext);
  const { isOpen, close } = useMobileMenu();
  const [activeId, setActiveId] = useState<string>('');
  const [secondaryActiveIds, setSecondaryActiveIds] = useState<Set<string>>(new Set());

  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<TOCItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add search filter function
  const filterTOCItems = (items: TOCItem[], query: string): TOCItem[] => {
    if (!query) return items;

    const filtered: TOCItem[] = [];
    
    items.forEach(item => {
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
      const filteredChildren = filterTOCItems(item.children, query);
      
      if (matchesQuery || filteredChildren.length > 0) {
        // Create a new item with only matching children
        filtered.push({
          ...item,
          children: filteredChildren
        });
        
        // If this item matches, automatically expand it and its parents
        if (matchesQuery) {
          setExpandedItems(prev => {
            const newSet = new Set(prev);
            const parentIds = getParentPath(tocItems, item.id);
            parentIds.forEach(id => newSet.add(id));
            newSet.add(item.id);
            return newSet;
          });
        }
      }
    });
    
    return filtered;
  };

  // Handle search input
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const filtered = filterTOCItems(tocItems, searchQuery);
      setFilteredItems(filtered);
    } else {
      setIsSearching(false);
      setFilteredItems([]);
    }
  }, [searchQuery, tocItems]);

  // New helper function to get all parent IDs of an item
  const getParentPath = (items: TOCItem[], targetId: string, path: string[] = []): string[] => {
    for (const item of items) {
      if (item.id === targetId) {
        return path;
      }
      const foundPath = getParentPath(item.children, targetId, [...path, item.id]);
      if (foundPath.length > 0) {
        return foundPath;
      }
    }
    return [];
  };

  useEffect(() => {
    const buildTOCStructure = () => {
      const mainContent = document.querySelector('main');
      if (!mainContent) return [];

      // Get all content blocks
      const blocks = Array.from(mainContent.querySelectorAll('.content-block'));
      
      // Create a map for quick lookup
      const blocksMap = new Map<string, TOCItem>();
      
      // First pass: Create TOC items
      blocks.forEach(block => {
        const id = block.id;
        // Look for title in either h4 or the first element with role="heading"
        const titleElement = block.querySelector('[role="heading"], h4');
        const title = titleElement?.textContent?.trim() || '';
        const type = block.getAttribute('data-block-type') || 'Generic';
        const showOnTOC = block.getAttribute('data-show-toc') !== 'false';
        
        // Get icon and color information
        const iconName = block.getAttribute('data-block-icon') || '';
        const iconColor = block.getAttribute('data-block-color') || '';
        
        if (id && title && showOnTOC) {
          blocksMap.set(id, {
            id,
            title,
            type,
            iconName,
            iconColor,
            children: []
          });
        }
      });

      // Second pass: Build hierarchy
      const rootItems: TOCItem[] = [];
      
      // Helper function to find the immediate parent block
      const findImmediateParent = (block: Element): string | null => {
        let current = block.parentElement;
        while (current) {
          if (current.classList.contains('content-block')) {
            return current.id;
          }
          current = current.parentElement;
        }
        return null;
      };

      blocks.forEach(block => {
        const id = block.id;
        // First try to get parent ID from data attribute, if not found try to find immediate parent
        const parentId = block.getAttribute('data-parent-id') || findImmediateParent(block);
        const tocItem = blocksMap.get(id);

        if (tocItem) {
          if (!parentId || !blocksMap.has(parentId)) {
            // Root level item
            rootItems.push(tocItem);
          } else {
            // Child item
            const parentItem = blocksMap.get(parentId);
            if (parentItem) {
              parentItem.children.push(tocItem);
            } else {
              // If parent not found, add to root
              rootItems.push(tocItem);
            }
          }
        }
      });

      // Sort function to maintain document order
      const sortByDOMOrder = (a: TOCItem, b: TOCItem) => {
        const aEl = document.getElementById(a.id);
        const bEl = document.getElementById(b.id);
        if (!aEl || !bEl) return 0;
        return aEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      };

      // Sort root items and their children recursively
      const sortTOCItems = (items: TOCItem[]) => {
        items.sort(sortByDOMOrder);
        items.forEach(item => {
          if (item.children.length > 0) {
            sortTOCItems(item.children);
          }
        });
      };

      sortTOCItems(rootItems);
      return rootItems;
    };

    const extractTOC = () => {
      const items = buildTOCStructure();
      setTocItems(items);
    };

    extractTOC();

    // Set up observer for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some(mutation => 
        mutation.type === 'childList' || 
        (mutation.type === 'attributes' && 
         ['id', 'data-block-type', 'data-show-toc', 'data-parent-id'].includes(mutation.attributeName || ''))
      );

      if (shouldUpdate) {
        extractTOC();
      }
    });

    observer.observe(document.querySelector('main') || document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'data-block-type', 'data-show-toc', 'data-parent-id']
    });

    return () => observer.disconnect();
  }, []);

  // Modified toggleItem to also handle content block expansion
  const toggleItem = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Modified scrollToItem to expand both TOC and content blocks
  const scrollToItem = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Get all parent IDs
    const parentIds = getParentPath(tocItems, id);
    
    // Expand all parents in TOC
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      parentIds.forEach(parentId => newSet.add(parentId));
      newSet.add(id);
      return newSet;
    });

    // Expand both the clicked item and all its parents in content blocks
    setExpandedBlocks(prev => {
      const newSet = new Set(prev);
      // Recursive function to add all ancestors
      const addAncestors = (itemId: string) => {
        newSet.add(itemId);
        const parentIds = getParentPath(tocItems, itemId);
        if (parentIds.length > 0) {
          addAncestors(parentIds[parentIds.length - 1]);
        }
      };
      // Start the recursive expansion from the clicked item
      addAncestors(id);
      return newSet;
    });
    
    // Scroll to the item
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Add Intersection Observer to track visible sections
  useEffect(() => {
    let activeElements = new Map<string, { distance: number; depth: number; rect: DOMRect }>();
    let visibleElements = new Map<string, { rect: DOMRect; depth: number }>();
  
    const updateActiveSection = () => {
      // Get all sections that are at least partially visible
      const sections = Array.from(document.querySelectorAll('.content-block'));
      
      // Reset maps
      activeElements.clear();
      visibleElements.clear();

      // First pass: collect all visible sections
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const buffer = window.innerHeight * 0.1;
        
        // If section is visible at all, add to visibleElements
        if (rect.top < (window.innerHeight + buffer) && rect.bottom > -buffer) {
          const depth = getBlockDepth(section);
          visibleElements.set(section.id, { rect, depth });
          
          // If section intersects middle zone, add to activeElements
          if (intersectsMiddleZone(rect)) {
            const distance = isElementInMiddleOfViewport(section);
            activeElements.set(section.id, { distance, depth, rect });
          }
        }
      });

      // Find the section closest to the middle from activeElements
      let closestSection: string | null = null;
      let minDistance = Infinity;
      let maxDepth = -1;

      activeElements.forEach(({ distance, depth }, id) => {
        if (depth > maxDepth) {
          closestSection = id;
          minDistance = distance;
          maxDepth = depth;
        } 
        else if (depth === maxDepth && distance < minDistance) {
          closestSection = id;
          minDistance = distance;
        }
      });

      if (closestSection) {
        setActiveId(closestSection);
        
        // Set all visible blocks as secondary
        const secondaryIds = new Set<string>();
        
        const isSubstantiallyVisible = (rect: DOMRect) => {
          const visibleThreshold = rect.height * 0.3;
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(window.innerHeight, rect.bottom);
          const visibleHeight = visibleBottom - visibleTop;
          return visibleHeight >= visibleThreshold;
        };

        // Add ALL visible blocks as secondary (except the active one)
        visibleElements.forEach(({ rect }, id) => {
          if (id !== closestSection && isSubstantiallyVisible(rect)) {
            secondaryIds.add(id);
          }
        });

        // Add parent blocks for all visible sections
        const addParentBlocks = (blockId: string) => {
          const parentIds = getParentPath(tocItems, blockId);
          parentIds.forEach(parentId => {
            if (visibleElements.has(parentId)) {
              secondaryIds.add(parentId);
            }
          });
        };

        // Add parents for all visible blocks
        visibleElements.forEach((_, id) => addParentBlocks(id));

        setSecondaryActiveIds(secondaryIds);

        // Update expanded items
        const parentIds = getParentPath(tocItems, closestSection);
        setExpandedItems(prev => {
          const newSet = new Set(prev);
          parentIds.forEach(id => newSet.add(id));
          newSet.add(closestSection!);
          return newSet;
        });
      } else {
        setActiveId('');
        setSecondaryActiveIds(new Set());
      }
    };

    // Debounced scroll handler
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveSection, 50);
    };

    // Handle rapid scrolling with requestAnimationFrame
    let ticking = false;
    const handleRapidScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial update
    updateActiveSection();

    // Add event listeners
    window.addEventListener('scroll', handleRapidScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleRapidScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [tocItems]); // Only re-run if tocItems changes

  const renderTOCItem = (item: TOCItem) => {
    const hasChildren = item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isPrimaryActive = activeId === item.id;
    const isSecondaryActive = secondaryActiveIds.has(item.id);
    
    // Get the appropriate icon component
    const IconComponent = (lucideIcons[capitalizeFirstLetter(item.iconName) as keyof typeof lucideIcons] || Box) as LucideIcon;

    // Determine icon color class based on block type and media type
    const getIconColorClass = () => {
      if (item.type === "Media") {
        // Extract media type from iconName (e.g., "Film" -> "Video")
        const mediaTypeMap: Record<string, MediaType> = {
          'Film': 'Video',
          'Music': 'Audio',
          'Image': 'Image',
          'Play': 'GIF'
        };
        const mediaType = mediaTypeMap[item.iconName] as MediaType;
        if (mediaType) {
          return mediaTypeConfig[mediaType].badgeClass.split(' ')[1]; // This will get the color class
        }
      }
      return item.iconColor;
    };

    return (
      <li key={item.id} className="mt-2">
        <div className="flex items-start gap-2">
          <div className="flex-none pt-1">
            {hasChildren ? (
              <button
                onClick={(e) => toggleItem(item.id, e)}
                className={cn(
                  "p-0.5 hover:bg-accent rounded-sm transition-colors",
                  getIconColorClass() // Apply the color class here
                )}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-5" /> // Spacing for items without children
            )}
          </div>
          <button
            onClick={(e) => scrollToItem(item.id, e)}
            className={cn(
              "flex-grow text-left text-sm transition-colors duration-200",
              "min-w-0", // Allow text to shrink
              "break-words", // Allow word breaking
              isPrimaryActive && "text-accent font-medium hover:text-accent/90 hover:bg-accent/10", // Enhanced hover effect
              isSecondaryActive && "text-accent/70 hover:text-accent/80 hover:bg-accent/10", // Enhanced hover effect
              !isPrimaryActive && !isSecondaryActive && "text-muted-foreground hover:text-foreground hover:bg-foreground/10"
            )}
          >
            <div className="flex items-center gap-2">
            <IconComponent 
              className={cn(
                "flex-none h-4 w-4 mt-0.5",
                getIconColorClass() // Apply the color class to the icon
              )} 
            />
            <span className="line-clamp-2 break-words">{item.title}</span>
            </div>
          </button>
        </div>
        
        {hasChildren && isExpanded && (
          <ul className="ml-4 border-l border-border/20 pl-2 mt-2">
            {item.children.map(renderTOCItem)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={cn(
      'toc-container rounded-lg border bg-card/50 p-4 backdrop-blur-sm',
      'flex flex-col',
      // Mobile styles (fixed full height)
      'fixed inset-y-0 left-0 w-[85vw] max-w-[400px] rounded-none border-r z-50', // Increased width
      isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none',
      // Desktop styles (sticky positioning)
      'lg:relative lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto lg:w-[320px] lg:min-w-[320px] lg:inset-auto', // Increased width and added min-width
      'lg:sticky lg:top-20', // top-20 should match your navbar height + desired spacing
      'lg:max-h-[calc(100vh-5rem)]', // Adjust based on your navbar height
      'transition-all duration-300 ease-in-out',
      className
    )}>
      {/* Header Section - Fixed */}
      <div className="flex-none border-b pb-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Table of Contents
            </h2>
            <button
              onClick={close}
              className="lg:hidden p-2 hover:bg-accent/50 rounded-lg"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Search input with proper width */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search contents..."
              className="w-full px-3 py-2 rounded-md bg-background/50 border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content List - Scrollable */}
      <div className="flex-1 overflow-y-auto mt-4 custom-scrollbar">
        <ul className="space-y-2 pr-2">
          {(isSearching ? filteredItems : tocItems).map(renderTOCItem)}
        </ul>
      </div>
    </nav>
  );
}
