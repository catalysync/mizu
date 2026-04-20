import type {
  BuilderProps,
  Config,
  ImmutableTree,
  JsonGroup,
} from '@react-awesome-query-builder/ui';
import { Builder, Query, Utils } from '@react-awesome-query-builder/ui';
import * as React from 'react';

const { checkTree, loadTree } = Utils;

export interface MizuAdvancedQueryBuilderProps {
  config: Config;
  value?: JsonGroup;
  onChange?: (tree: ImmutableTree, config: Config) => void;
  className?: string;
}

const renderBuilder = (props: BuilderProps) => <Builder {...props} />;

export const MizuAdvancedQueryBuilder: React.FC<MizuAdvancedQueryBuilderProps> = ({
  config,
  value,
  onChange,
  className,
}) => {
  const [tree, setTree] = React.useState<ImmutableTree>(() => {
    const initial: JsonGroup = value ?? { id: '1', type: 'group', children1: [] };
    return checkTree(loadTree(initial), config);
  });

  const handleChange = React.useCallback(
    (immutableTree: ImmutableTree, cfg: Config) => {
      setTree(immutableTree);
      onChange?.(immutableTree, cfg);
    },
    [onChange],
  );

  const classes = ['mizu-advanced-query-builder', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <Query {...config} value={tree} onChange={handleChange} renderBuilder={renderBuilder} />
    </div>
  );
};

MizuAdvancedQueryBuilder.displayName = 'MizuAdvancedQueryBuilder';
