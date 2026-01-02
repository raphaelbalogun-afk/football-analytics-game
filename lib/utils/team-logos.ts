/**
 * Team Logo Mapping
 * 
 * Maps team names to their logo URLs or emoji representations
 */

export const TEAM_LOGOS: Record<string, string> = {
  'Manchester City': 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png',
  'Liverpool': 'https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png',
  'Arsenal': 'https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png',
  'Chelsea': 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png',
  'Manchester United': 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png',
  'Tottenham': 'https://logos-world.net/wp-content/uploads/2020/06/Tottenham-Logo.png',
  'Everton': 'https://logos-world.net/wp-content/uploads/2020/06/Everton-Logo.png',
  'Fulham': 'https://logos-world.net/wp-content/uploads/2020/06/Fulham-Logo.png',
  'Newcastle': 'https://logos-world.net/wp-content/uploads/2020/06/Newcastle-United-Logo.png',
  'Brighton': 'https://logos-world.net/wp-content/uploads/2020/06/Brighton-Logo.png',
  'West Ham': 'https://logos-world.net/wp-content/uploads/2020/06/West-Ham-Logo.png',
  'Aston Villa': 'https://logos-world.net/wp-content/uploads/2020/06/Aston-Villa-Logo.png',
  'Crystal Palace': 'https://logos-world.net/wp-content/uploads/2020/06/Crystal-Palace-Logo.png',
  'Wolves': 'https://logos-world.net/wp-content/uploads/2020/06/Wolves-Logo.png',
  'Brentford': 'https://logos-world.net/wp-content/uploads/2020/06/Brentford-Logo.png',
  'Leicester': 'https://logos-world.net/wp-content/uploads/2020/06/Leicester-City-Logo.png',
  'Southampton': 'https://logos-world.net/wp-content/uploads/2020/06/Southampton-Logo.png',
  'Leeds': 'https://logos-world.net/wp-content/uploads/2020/06/Leeds-United-Logo.png',
  'Burnley': 'https://logos-world.net/wp-content/uploads/2020/06/Burnley-Logo.png',
  'Watford': 'https://logos-world.net/wp-content/uploads/2020/06/Watford-Logo.png',
  'Norwich': 'https://logos-world.net/wp-content/uploads/2020/06/Norwich-Logo.png',
  'Sheffield United': 'https://logos-world.net/wp-content/uploads/2020/06/Sheffield-United-Logo.png',
  'Luton': 'https://logos-world.net/wp-content/uploads/2020/06/Luton-Town-Logo.png',
  'Nottingham Forest': 'https://logos-world.net/wp-content/uploads/2020/06/Nottingham-Forest-Logo.png',
  'Bournemouth': 'https://logos-world.net/wp-content/uploads/2020/06/Bournemouth-Logo.png',
  'Ipswich': 'https://logos-world.net/wp-content/uploads/2020/06/Ipswich-Logo.png'
}

/**
 * Get team logo URL or return a default emoji
 */
export function getTeamLogo(teamName: string): string {
  return TEAM_LOGOS[teamName] || '🏟️'
}

