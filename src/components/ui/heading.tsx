import React, { JSXElementConstructor, CSSProperties } from 'react';
import { cn } from '@/assets/styles/utils';

interface Props {
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode | any;
  html?: string;
}

type Variant =
  | 'xxl'
  | 'xl'
  | 'lg'
  | 'base'
  | 'sm'
  | 'xs';

const Heading: React.FC<Props> = ({
  style,
  className,
  variant = 'base',
  children,
  html,
}) => {
  const componentsMap: {
    [P in Variant]: React.ComponentType<any> | string;
  } = {
    xxl: 'h1',
    xl: 'h1',
    lg: 'h2',
    base: 'h3',
    sm: 'h4',
    xs: 'h4',
  };

  const Component:
    | JSXElementConstructor<any>
    | React.ReactElement<any>
    | React.ComponentType<any>
    | string = componentsMap![variant!];

  const htmlContentProps = html
    ? {
        dangerouslySetInnerHTML: { __html: html },
      }
    : {};

  return (
    <Component
      className={cn(
        'text-fill-base text-muted-foreground',
        {
          'text-4xl font-extrabold tracking-wide': variant === 'xxl',
          'text-3xl font-extrabold tracking-wide': variant === 'xl',
          'text-xl font-bold tracking-tight': variant === 'lg',
          'text-base font-semibold tracking-tight': variant === 'base',
          'text-sm font-semibold': variant === 'sm',
          'text-sm font-normal': variant === 'xs',
        },
        className
      )}
      style={style}
      {...htmlContentProps}
    >
      {children}
    </Component>
  );
};

export default Heading;
