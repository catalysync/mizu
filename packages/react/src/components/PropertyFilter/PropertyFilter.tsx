import * as React from 'react';
import { cn } from '../../utils/cn';

export type PropertyFilterOperator =
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'contains'
  | 'startsWith';

// Symbolic operators must be tried longest-first so "!=" is not read as "!" then "=".
const SYMBOL_PATTERN = /^(.*?)\s*(!=|>=|<=|=|>|<|:)\s*(.*)$/;
const WORD_PATTERN = /^(.*?)\s+(contains|startsWith)\s+(.*)$/;

export interface PropertyFilterProperty {
  key: string;
  label: string;
  /** Operators a user may pick for this property. Defaults to `['=']`. */
  operators?: PropertyFilterOperator[];
  /** Known values, offered as keyboard-selectable suggestions once the property is typed. */
  options?: string[];
}

export interface PropertyFilterToken {
  propertyKey: string;
  operator: PropertyFilterOperator;
  value: string;
}

export interface PropertyFilterQuery {
  operation: 'and' | 'or';
  tokens: PropertyFilterToken[];
}

export interface PropertyFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  query: PropertyFilterQuery;
  onQueryChange: (query: PropertyFilterQuery) => void;
  properties: PropertyFilterProperty[];
  placeholder?: string;
  countText?: string;
}

type Suggestion =
  | { kind: 'property'; key: string; label: string }
  | {
      kind: 'value';
      propertyKey: string;
      operator: PropertyFilterOperator;
      value: string;
    };

interface ParsedInput {
  label: string;
  operator: PropertyFilterOperator | ':';
  value: string;
}

function parseInput(input: string): ParsedInput | null {
  const symbol = SYMBOL_PATTERN.exec(input);
  if (symbol) {
    return {
      label: symbol[1].trim(),
      operator: symbol[2] as PropertyFilterOperator | ':',
      value: symbol[3].trim(),
    };
  }
  const word = WORD_PATTERN.exec(input);
  if (word) {
    return {
      label: word[1].trim(),
      operator: word[2] as PropertyFilterOperator,
      value: word[3].trim(),
    };
  }
  return null;
}

function allowedOperators(property: PropertyFilterProperty): PropertyFilterOperator[] {
  return property.operators ?? ['='];
}

function findProperty(properties: PropertyFilterProperty[], label: string) {
  const needle = label.trim().toLowerCase();
  return properties.find((p) => p.label.toLowerCase() === needle || p.key.toLowerCase() === needle);
}

// A bare ":" means equality unless the property only allows other operators.
function resolveOperator(
  property: PropertyFilterProperty,
  operator: PropertyFilterOperator | ':',
): PropertyFilterOperator | null {
  const allowed = allowedOperators(property);
  const resolved = operator === ':' ? (allowed.includes('=') ? '=' : allowed[0]) : operator;
  return resolved && allowed.includes(resolved) ? resolved : null;
}

export const PropertyFilter = React.forwardRef<HTMLDivElement, PropertyFilterProps>(
  (
    {
      query,
      onQueryChange,
      properties,
      placeholder = 'Filter by property or value',
      countText,
      className,
      ...props
    },
    ref,
  ) => {
    const listboxId = React.useId();
    const [inputValue, setInputValue] = React.useState('');
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const parsed = React.useMemo(() => parseInput(inputValue), [inputValue]);
    const matchedProperty = parsed ? findProperty(properties, parsed.label) : undefined;

    const suggestions = React.useMemo((): Suggestion[] => {
      // Once a property and operator are typed, suggest that property's known values.
      if (parsed && matchedProperty) {
        const operator = resolveOperator(matchedProperty, parsed.operator);
        if (!operator || !matchedProperty.options) return [];
        const needle = parsed.value.toLowerCase();
        return matchedProperty.options
          .filter((option) => option.toLowerCase().includes(needle))
          .map((option) => ({
            kind: 'value' as const,
            propertyKey: matchedProperty.key,
            operator,
            value: option,
          }));
      }
      const needle = inputValue.toLowerCase();
      return properties
        .filter((p) => p.label.toLowerCase().includes(needle))
        .map((p) => ({ kind: 'property' as const, key: p.key, label: p.label }));
    }, [inputValue, parsed, matchedProperty, properties]);

    const isOpen = showSuggestions && suggestions.length > 0;
    const active = isOpen && activeIndex < suggestions.length ? activeIndex : -1;
    const activeId = active >= 0 ? `${listboxId}-${active}` : undefined;

    const addToken = (propertyKey: string, operator: PropertyFilterOperator, value: string) => {
      onQueryChange({
        ...query,
        tokens: [...query.tokens, { propertyKey, operator, value }],
      });
      setInputValue('');
      setActiveIndex(-1);
      setShowSuggestions(false);
    };

    const removeToken = (index: number) => {
      onQueryChange({
        ...query,
        tokens: query.tokens.filter((_, i) => i !== index),
      });
    };

    const selectSuggestion = (suggestion: Suggestion) => {
      if (suggestion.kind === 'property') {
        // Stay open: the next step offers that property's values.
        setInputValue(`${suggestion.label}: `);
        setActiveIndex(-1);
        setShowSuggestions(true);
        return;
      }
      addToken(suggestion.propertyKey, suggestion.operator, suggestion.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (suggestions.length === 0) return;
        e.preventDefault();
        setShowSuggestions(true);
        const step = e.key === 'ArrowDown' ? 1 : -1;
        const count = suggestions.length;
        const from = active < 0 ? (step > 0 ? -1 : 0) : active;
        setActiveIndex((from + step + count) % count);
        return;
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setShowSuggestions(false);
        setActiveIndex(-1);
        return;
      }
      if (e.key !== 'Enter') return;
      if (active >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[active]);
        return;
      }
      if (parsed && matchedProperty && parsed.value) {
        const operator = resolveOperator(matchedProperty, parsed.operator);
        if (operator) {
          e.preventDefault();
          addToken(matchedProperty.key, operator, parsed.value);
        }
      }
    };

    return (
      <div
        ref={ref}
        data-component="mizu-property-filter"
        className={cn('mizu-filter-bar', className)}
        {...props}
      >
        <div className="mizu-filter-bar__controls">
          <div className="mizu-filter-bar__input-wrap">
            <input
              type="text"
              role="combobox"
              className="mizu-input mizu-input--sm mizu-filter-bar__input"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setActiveIndex(-1);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setShowSuggestions(false);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label="Property filter"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={isOpen ? listboxId : undefined}
              aria-activedescendant={activeId}
            />
            {isOpen && (
              <ul
                id={listboxId}
                role="listbox"
                aria-label="Suggestions"
                className="mizu-dropdown-menu mizu-filter-bar__suggestions"
              >
                {suggestions.map((s, i) => {
                  const id = `${listboxId}-${i}`;
                  const text =
                    s.kind === 'property'
                      ? s.label
                      : `${properties.find((p) => p.key === s.propertyKey)?.label ?? s.propertyKey} ${s.operator} ${s.value}`;
                  return (
                    <li
                      key={`${s.kind}-${s.kind === 'property' ? s.key : `${s.propertyKey}-${s.value}`}`}
                      id={id}
                      role="option"
                      aria-selected={i === active}
                      className="mizu-dropdown-menu__item"
                      data-highlighted={i === active || undefined}
                      // Keeps focus in the input so the click lands before the list closes.
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(s);
                      }}
                    >
                      {text}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {countText && <span className="mizu-caption">{countText}</span>}
        </div>
        {query.tokens.length > 0 && (
          <div className="mizu-filter-bar__pills">
            {query.tokens.map((t, i) => {
              const prop = properties.find((p) => p.key === t.propertyKey);
              return (
                <span key={`${t.propertyKey}-${i}`} className="mizu-filter-pill">
                  <span className="mizu-filter-pill__label">{prop?.label ?? t.propertyKey}</span>
                  <span className="mizu-filter-pill__value">
                    {t.operator} {t.value}
                  </span>
                  <button
                    type="button"
                    className="mizu-filter-pill__remove"
                    onClick={() => removeToken(i)}
                    aria-label={`Remove ${prop?.label} filter`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="10"
                      height="10"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
            {query.tokens.length > 1 && (
              <button
                type="button"
                className="mizu-filter-bar__clear"
                onClick={() => onQueryChange({ ...query, tokens: [] })}
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
PropertyFilter.displayName = 'PropertyFilter';
