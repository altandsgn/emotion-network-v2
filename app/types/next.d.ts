import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

declare module 'next' {
  export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}

declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }
}

declare module 'next/link' {
  import { ForwardRefExoticComponent, RefAttributes } from 'react';
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  
  const Link: ForwardRefExoticComponent<NextLinkProps & RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

export {}; 