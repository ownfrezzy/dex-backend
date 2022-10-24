export function sleep(timer: number) {
  return new Promise((resolve) => setTimeout(resolve, timer));
}
