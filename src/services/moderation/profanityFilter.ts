// Profanity filter implementation
const profanityList = new Set([
  // English profanity
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'cunt', 'dick', 'cock', 'pussy', 'whore',
  // Common variations and misspellings
  'fuk', 'fck', 'sh1t', 'b1tch', 'f*ck', 's*it', 'a$$',
  // Creole profanity (sample - extend as needed)
  'kouyon', 'makoumè', 'makak', 'bonda', 'koukoun', 'bounda'
]);

export function containsProfanity(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/);
  return words.some(word => {
    // Remove common substitutions
    const cleaned = word
      .replace(/[0-9]/g, 'i')
      .replace(/[$@*]/g, '')
      .replace(/[^\w\s]/gi, '');
    return profanityList.has(cleaned);
  });
}

export function moderateContent(text: string): string {
  const words = text.split(/\s+/);
  return words.map(word => {
    const cleaned = word
      .toLowerCase()
      .replace(/[0-9]/g, 'i')
      .replace(/[$@*]/g, '')
      .replace(/[^\w\s]/gi, '');
    
    if (profanityList.has(cleaned)) {
      return '*'.repeat(word.length);
    }
    return word;
  }).join(' ');
}