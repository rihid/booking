import React from "react";
import { cn } from "@/assets/styles/utils";

interface Props {
  className?: string;
  children?: any;
  el?: keyof JSX.IntrinsicElements;
}

const Container: React.FC<Props> = ({
  children,
  className,
  el = 'div',
}) => {
  const rootClassName = cn(className, 'w-full mx-auto px-[30px]');

  let Component: React.ComponentType<React.HTMLAttributes<HTMLDivElement>> =
    el as any;

  return <Component className={rootClassName}>{children}</Component>;
};

export default Container;
