// This is a simplified moon phase calculation
// In a production app, you would use a more accurate astronomical library

/**
 * Calculate the moon phase for a given date
 * @param date The date to calculate the moon phase for
 * @returns The name of the moon phase
 */
export function getMoonPhase(date: Date): string {
  // Moon cycle is approximately 29.53 days
  const MOON_CYCLE = 29.53;
  
  // Jan 6, 2000 was a new moon
  const KNOWN_NEW_MOON = new Date('2000-01-06T00:00:00Z');
  
  // Calculate days since known new moon
  const daysSinceNewMoon = (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate current position in cycle (0 to 1)
  const position = (daysSinceNewMoon % MOON_CYCLE) / MOON_CYCLE;
  
  // Determine the phase name based on position
  if (position < 0.025) return 'New Moon';
  if (position < 0.225) return 'Waxing Crescent';
  if (position < 0.275) return 'First Quarter';
  if (position < 0.475) return 'Waxing Gibbous';
  if (position < 0.525) return 'Full Moon';
  if (position < 0.725) return 'Waning Gibbous';
  if (position < 0.775) return 'Last Quarter';
  if (position < 0.975) return 'Waning Crescent';
  return 'New Moon';
}

/**
 * Calculate the moon illumination percentage
 * @param date The date to calculate for
 * @returns A value between 0 and 1 representing illumination percentage
 */
export function getMoonIllumination(date: Date): number {
  const MOON_CYCLE = 29.53;
  const KNOWN_NEW_MOON = new Date('2000-01-06T00:00:00Z');
  
  const daysSinceNewMoon = (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  const position = (daysSinceNewMoon % MOON_CYCLE) / MOON_CYCLE;
  
  // Simple approximation of illumination using a sine wave
  // 0 = new moon, 0.5 = full moon, 1 = new moon again
  const illumination = Math.sin(position * Math.PI);
  
  return Math.abs(illumination);
}

/**
 * Calculate the date of the next full moon
 * @param date The reference date
 * @returns Date object representing the next full moon
 */
export function getNextFullMoonDate(date: Date): Date {
  const MOON_CYCLE = 29.53;
  const KNOWN_NEW_MOON = new Date('2000-01-06T00:00:00Z');
  
  const daysSinceNewMoon = (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  const position = (daysSinceNewMoon % MOON_CYCLE) / MOON_CYCLE;
  
  // Calculate days until next full moon (position 0.5)
  let daysUntilFullMoon;
  if (position < 0.5) {
    daysUntilFullMoon = (0.5 - position) * MOON_CYCLE;
  } else {
    daysUntilFullMoon = (1.5 - position) * MOON_CYCLE;
  }
  
  // Create new date for next full moon
  const nextFullMoon = new Date(date);
  nextFullMoon.setDate(date.getDate() + Math.round(daysUntilFullMoon));
  
  return nextFullMoon;
}