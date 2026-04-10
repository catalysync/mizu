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

export interface PropertyFilterProperty {
  key: string;
  label: string;
  operators?: PropertyFilterOperator[];
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
    const [inputValue, setInputValue] = React.useState('');
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    const suggestions = React.useMemo(() => {
      if (!inputValue)
        return properties.map((p) => ({ type: 'property' as const, label: p.label, key: p.key }));
      return properties
        .filter((p) => p.label.toLowerCase().includes(inputValue.toLowerCase()))
        .map((p) => ({ type: 'property' as const, label: p.label, key: p.key }));
    }, [inputValue, properties]);

    const addToken = (propertyKey: string, operator: PropertyFilterOperator, value: string) => {
      onQueryChange({
        ...query,
        tokens: [...query.tokens, { propertyKey, operator, value }],
      });
      setInputValue('');
      setShowSuggestions(false);
    };

    const removeToken = (index: number) => {
      onQueryChange({
        ...query,
        tokens: query.tokens.filter((_, i) => i !== index),
      });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && inputValue.includes(':')) {
        const [propPart, ...valueParts] = inputValue.split(':');
        const value = valueParts.join(':').trim();
        const prop = properties.find(
          (p) =>
            p.label.toLowerCase() === propPart.trim().toLowerCase() || p.key === propPart.trim(),
        );
        if (prop && value) {
          addToken(prop.key, '=', value);
        }
      }
    };

    return (
      <div ref={ref} className={cn('mizu-filter-bar', className)} {...props}>
        <div className="mizu-filter-bar__controls">
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="mizu-input mizu-input--sm"
              style={{ width: '100%' }}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label="Property filter"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="mizu-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '0.25rem',
                }}
              >
                {suggestions.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    className="mizu-dropdown-menu__item"
                    onMouseDown={() => {
                      setInputValue(`${s.label}: `);
                      setShowSuggestions(false);
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
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
                  {t.operator} {t.value}
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
