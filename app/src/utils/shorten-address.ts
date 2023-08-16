export function shortenAddress(address: string, digits = 4): string {
  const prefixLength = digits + 2;

  if (address.length <= prefixLength) {
    return address;
  }

  const prefix = address.slice(0, digits);
  const suffix = address.slice(-digits);

  return `${prefix}...${suffix}`;
}
