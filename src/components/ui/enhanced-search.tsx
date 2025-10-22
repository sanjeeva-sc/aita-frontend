import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Filter, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { cn } from '@/lib/utils';
import { AnimatedContainer, AnimatedList, AnimatedListItem } from './animations';

export interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'recent' | 'popular' | 'suggestion';
  category?: string;
  count?: number;
}

export interface SearchFilter {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string, filters: string[]) => void;
  suggestions?: SearchSuggestion[];
  filters?: SearchFilter[];
  recentSearches?: string[];
  popularSearches?: string[];
  debounceMs?: number;
  showFilters?: boolean;
  showSuggestions?: boolean;
  className?: string;
  loading?: boolean;
  resultCount?: number;
}

export const EnhancedSearch: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  suggestions = [],
  filters = [],
  recentSearches = [],
  popularSearches = [],
  debounceMs = 300,
  showFilters = true,
  showSuggestions = true,
  className,
  loading = false,
  resultCount
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search
  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(query, selectedFilters);
      }
    }, debounceMs);
  }, [onSearch, selectedFilters, debounceMs]);

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    
    if (newValue.trim()) {
      setShowSuggestionDropdown(true);
      debouncedSearch(newValue);
    } else {
      setShowSuggestionDropdown(false);
    }
    
    setFocusedSuggestionIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.text);
    setShowSuggestionDropdown(false);
    if (onChange) {
      onChange(suggestion.text);
    }
    if (onSearch) {
      onSearch(suggestion.text, selectedFilters);
    }
  };

  // Handle filter toggle
  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newFilters);
    
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue, newFilters);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionDropdown) return;

    const allSuggestions = [
      ...recentSearches.map(text => ({ id: text, text, type: 'recent' as const })),
      ...popularSearches.map(text => ({ id: text, text, type: 'popular' as const })),
      ...suggestions
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedSuggestionIndex >= 0 && allSuggestions[focusedSuggestionIndex]) {
          handleSuggestionSelect(allSuggestions[focusedSuggestionIndex]);
        } else if (searchValue.trim()) {
          setShowSuggestionDropdown(false);
          if (onSearch) {
            onSearch(searchValue, selectedFilters);
          }
        }
        break;
      case 'Escape':
        setShowSuggestionDropdown(false);
        setFocusedSuggestionIndex(-1);
        break;
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchValue('');
    setShowSuggestionDropdown(false);
    if (onChange) {
      onChange('');
    }
    inputRef.current?.focus();
  };

  // Prepare suggestions for display
  const allSuggestions = [
    ...recentSearches.map(text => ({ id: text, text, type: 'recent' as const })),
    ...popularSearches.map(text => ({ id: text, text, type: 'popular' as const })),
    ...suggestions
  ];

  const filteredSuggestions = allSuggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Group suggestions by type
  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    const type = suggestion.type || 'suggestion';
    if (!acc[type]) acc[type] = [];
    acc[type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4 text-gray-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'recent':
        return 'Recent Searches';
      case 'popular':
        return 'Popular Searches';
      default:
        return 'Suggestions';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll focused suggestion into view
  useEffect(() => {
    if (focusedSuggestionIndex >= 0 && suggestionRefs.current[focusedSuggestionIndex]) {
      suggestionRefs.current[focusedSuggestionIndex]?.scrollIntoView({
        block: 'nearest'
      });
    }
  }, [focusedSuggestionIndex]);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchValue.trim() && showSuggestions) {
                  setShowSuggestionDropdown(true);
                }
              }}
              className="pl-10 pr-10"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestionDropdown && showSuggestions && (
            <AnimatedContainer
              variant="fadeInDown"
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto"
            >
              {Object.keys(groupedSuggestions).length > 0 ? (
                <div className="p-2">
                  {Object.entries(groupedSuggestions).map(([type, suggestions]) => (
                    <div key={type} className="mb-2 last:mb-0">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {getSuggestionIcon(type)}
                        {getSuggestionLabel(type)}
                      </div>
                      <AnimatedList>
                        {suggestions.slice(0, 5).map((suggestion, index) => {
                          const globalIndex = Object.entries(groupedSuggestions)
                            .slice(0, Object.keys(groupedSuggestions).indexOf(type))
                            .reduce((acc, [, items]) => acc + items.length, 0) + index;
                          
                          return (
                            <AnimatedListItem key={suggestion.id}>
                              <div
                                ref={el => suggestionRefs.current[globalIndex] = el}
                                className={cn(
                                  'flex items-center justify-between px-3 py-2 cursor-pointer rounded-md transition-colors',
                                  focusedSuggestionIndex === globalIndex
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'hover:bg-gray-50'
                                )}
                                onClick={() => handleSuggestionSelect(suggestion)}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="truncate">{suggestion.text}</span>
                                  {suggestion.category && (
                                    <Badge variant="secondary" className="text-xs">
                                      {suggestion.category}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                  {suggestion.count && (
                                    <span className="text-xs">{suggestion.count}</span>
                                  )}
                                  <ArrowRight className="h-3 w-3" />
                                </div>
                              </div>
                            </AnimatedListItem>
                          );
                        })}
                      </AnimatedList>
                    </div>
                  ))}
                </div>
              ) : searchValue.trim() ? (
                <div className="p-4 text-center text-gray-500">
                  No suggestions found
                </div>
              ) : null}
            </AnimatedContainer>
          )}
        </div>

        {/* Filters */}
        {showFilters && filters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {selectedFilters.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                    {selectedFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <Command>
                <CommandInput placeholder="Search filters..." />
                <CommandList>
                  <CommandEmpty>No filters found.</CommandEmpty>
                  <CommandGroup heading="Filters">
                    {filters.map((filter) => (
                      <CommandItem
                        key={filter.id}
                        onSelect={() => handleFilterToggle(filter.id)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'h-4 w-4 border rounded',
                              selectedFilters.includes(filter.id)
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300'
                            )}
                          >
                            {selectedFilters.includes(filter.id) && (
                              <div className="h-full w-full flex items-center justify-center">
                                <div className="h-2 w-2 bg-white rounded-sm" />
                              </div>
                            )}
                          </div>
                          <span>{filter.label}</span>
                        </div>
                        {filter.count && (
                          <Badge variant="secondary" className="text-xs">
                            {filter.count}
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <AnimatedContainer className="flex flex-wrap gap-2 mt-3">
          {selectedFilters.map((filterId) => {
            const filter = filters.find(f => f.id === filterId);
            if (!filter) return null;
            
            return (
              <Badge
                key={filterId}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {filter.label}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterToggle(filterId)}
                  className="h-4 w-4 p-0 hover:bg-gray-300"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </AnimatedContainer>
      )}

      {/* Result Count */}
      {resultCount !== undefined && searchValue.trim() && (
        <div className="mt-2 text-sm text-gray-600">
          {resultCount === 0 ? 'No results found' : `${resultCount} result${resultCount === 1 ? '' : 's'} found`}
        </div>
      )}
    </div>
  );
};