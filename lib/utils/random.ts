export function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return function() {
    hash = Math.sin(hash++) * 10000;
    return hash - Math.floor(hash);
  };
}
