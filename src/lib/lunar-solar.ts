// Simplified lunar-to-solar conversion
// For accurate results, we use a pre-calculated offset table for common years
// This covers 1960-2010 which is our app's range

// Each entry: [lunarNewYearMonth, lunarNewYearDay] for that solar year
// Lunar New Year dates (solar calendar equivalent)
const LUNAR_NEW_YEAR: Record<number, [number, number]> = {
  1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25], 1964: [2, 13],
  1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30], 1969: [2, 17],
  1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3], 1974: [1, 23],
  1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
  1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
  1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
  2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
  2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14]
};

// Approximate lunar-to-solar conversion
// Lunar dates are roughly 20-50 days behind solar dates
// This uses the lunar new year offset for the given year
export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number): { year: number; month: number; day: number } {
  const lny = LUNAR_NEW_YEAR[lunarYear];
  if (!lny) {
    // Fallback: approximate by adding 30 days
    const d = new Date(lunarYear, lunarMonth - 1, lunarDay + 33);
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  // Calculate offset: lunar new year is lunar month 1, day 1
  // So lunar month M, day D = lny date + (M-1)*29.5 + (D-1) days approximately
  const lnyDate = new Date(lunarYear, lny[0] - 1, lny[1]);
  const daysOffset = Math.round((lunarMonth - 1) * 29.53) + (lunarDay - 1);
  const solarDate = new Date(lnyDate.getTime() + daysOffset * 86400000);

  return {
    year: solarDate.getFullYear(),
    month: solarDate.getMonth() + 1,
    day: solarDate.getDate()
  };
}
