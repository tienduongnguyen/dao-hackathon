import React, { useCallback } from 'react';

import { ColorToolbar } from './color-toolbar';
import { DefaultToolbar } from './default-toolbar';
import { TextSizeToolbar } from './text-size-toolbar';
import { ToolbarProps } from './type';

export const Toolbar = (props: ToolbarProps) => {
  const { type } = props;

  // function
  const renderToolbar = useCallback(() => {
    if (type === 'text-size') {
      return <TextSizeToolbar {...props} />;
    }
    if (type === 'color') {
      return <ColorToolbar {...props} />;
    }
    return <DefaultToolbar {...props} />;
  }, [props, type]);

  // render
  return <>{renderToolbar()}</>;
};
