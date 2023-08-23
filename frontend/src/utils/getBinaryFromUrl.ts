export async function getBinaryFromUrl(url: string): Promise<number[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  const intermediate = new Uint8Array(buffer);
  const binaryArray: number[] = Array.from(intermediate);
  return binaryArray;
}
