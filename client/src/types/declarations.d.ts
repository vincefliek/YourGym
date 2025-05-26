declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent};
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

interface Window {
  _debugTools_?: {
    store: import('../model/store').Store;
    validator: import('jsonschema').Validator;
    apis: any;
  }
}
