import * as React from 'react';
import type {
  FullCombinator,
  FullField,
  FullOperator,
  QueryBuilderProps,
  RuleGroupType,
} from 'react-querybuilder';
import { QueryBuilder } from 'react-querybuilder';

type BaseQBProps = QueryBuilderProps<RuleGroupType, FullField, FullOperator, FullCombinator>;

export interface MizuQueryBuilderProps extends Omit<BaseQBProps, 'controlClassnames'> {
  className?: string;
}

export const MizuQueryBuilder = React.forwardRef<HTMLDivElement, MizuQueryBuilderProps>(
  ({ className, ...props }, ref) => {
    const classes = ['mizu-query-builder', className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes}>
        <QueryBuilder
          {...props}
          controlClassnames={{
            queryBuilder: '',
            ruleGroup: 'ruleGroup',
            header: 'ruleGroup-header',
            body: 'ruleGroup-body',
            combinators: 'ruleGroup-combinators',
            addRule: 'ruleGroup-addRule',
            addGroup: 'ruleGroup-addGroup',
            removeGroup: 'ruleGroup-remove',
            rule: 'rule',
            fields: 'rule-fields',
            operators: 'rule-operators',
            value: 'rule-value',
            removeRule: 'rule-remove',
            notToggle: 'rule-notToggle',
            dragHandle: 'queryBuilder-dragHandle',
            lockRule: 'rule-lock',
            lockGroup: 'ruleGroup-lock',
            cloneRule: 'rule-cloneRule',
            cloneGroup: 'ruleGroup-cloneGroup',
          }}
        />
      </div>
    );
  },
);
MizuQueryBuilder.displayName = 'MizuQueryBuilder';
