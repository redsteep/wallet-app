interface WrapProps {
  if: boolean;
  with: (children: React.ReactNode) => JSX.Element;
}

export function Wrap({
  if: condition,
  with: wrapper,
  children,
}: React.PropsWithChildren<WrapProps>) {
  return condition ? wrapper(children) : <>{children}</>;
}
