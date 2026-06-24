export const getCurrencyForLocation = (location: string) => {
  const loc = location.toLowerCase();
  if (loc.includes('cameroon') || loc.includes('cameroun') || loc.includes('yaoundé') || loc.includes('yaounde') || loc.includes('douala') || loc.includes('bamenda') || loc.includes('buea')) {
    return { code: 'XAF', symbol: 'FCFA', name: 'Cameroon (FCFA)' };
  }
  if (loc.includes('nigeria') || loc.includes('lagos') || loc.includes('abuja')) {
    return { code: 'NGN', symbol: '₦', name: 'Nigeria (₦)' };
  }
  if (loc.includes('kenya') || loc.includes('nairobi') || loc.includes('mombasa')) {
    return { code: 'KES', symbol: 'KSh', name: 'Kenya (KSh)' };
  }
  if (loc.includes('united kingdom') || loc.includes('london') || loc.includes('manchester') || loc.includes(', uk') || loc.endsWith(' uk')) {
    return { code: 'GBP', symbol: '£', name: 'UK (£)' };
  }
  if (loc.includes('france') || loc.includes('germany') || loc.includes('spain') || loc.includes('italy') || loc.includes('europe') || loc.includes('paris') || loc.includes('berlin') || loc.includes('rome')) {
    return { code: 'EUR', symbol: '€', name: 'Europe (€)' };
  }
  if (loc.includes('canada') || loc.includes('toronto') || loc.includes('vancouver') || loc.includes('montreal')) {
    return { code: 'CAD', symbol: 'CA$', name: 'Canada (CA$)' };
  }
  if (loc.includes('australia') || loc.includes('sydney') || loc.includes('melbourne') || loc.includes('perth')) {
    return { code: 'AUD', symbol: 'A$', name: 'Australia (A$)' };
  }
  if (loc.includes('india') || loc.includes('delhi') || loc.includes('mumbai') || loc.includes('bangalore')) {
    return { code: 'INR', symbol: '₹', name: 'India (₹)' };
  }
  if (loc.includes('south africa') || loc.includes('johannesburg') || loc.includes('cape town')) {
    return { code: 'ZAR', symbol: 'R', name: 'South Africa (R)' };
  }
  return { code: 'USD', symbol: '$', name: 'USA ($)' };
};

export const formatPriceWithCountry = (price: number, location: string) => {
  const { code, symbol } = getCurrencyForLocation(location);
  try {
    if (code === 'XAF') {
      return `${new Intl.NumberFormat('fr-CM', { maximumFractionDigits: 0 }).format(price)} FCFA`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${symbol}${price}`;
  }
};
