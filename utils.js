export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const hexToUInt32 = (hex)=>{
    const r = hex.slice(1, 3);
  const g = hex.slice(3, 5);
  const b = hex.slice(5, 7);
  return parseInt(`0xFF${b}${g}${r}`)
}