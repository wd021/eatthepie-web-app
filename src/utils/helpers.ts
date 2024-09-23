export const trimAddress = (
  addr: string,
  startLength: number = 4,
  endLength: number = 4
): string => {
  if (typeof addr !== "string") {
    throw new Error("Address must be a string");
  }

  if (startLength < 0 || endLength < 0) {
    throw new Error("Start and end lengths must be non-negative");
  }

  if (addr.length <= startLength + endLength) {
    return addr;
  }

  return `${addr.slice(0, startLength)}...${addr.slice(-endLength)}`;
};
