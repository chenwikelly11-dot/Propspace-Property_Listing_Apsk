
export function formatCurrencyXAF(value) {
  if (value === undefined || value === null) return '0 FCFA';
  return `${Math.round(value).toLocaleString('fr-FR')} FCFA`;
}


export function formatCurrencyUSD(value) {
  if (value === undefined || value === null) return '$0';
  return `$${Math.round(value).toLocaleString('en-US')}`;
}


export function formatLocation(location) {
  if (!location) return '';
  const parts = location.split(',');
  if (parts.length > 2) {
    return `${parts[0].trim()}, ${parts[parts.length - 1].trim()}`;
  }
  return location;
}


export function calculateMortgageQuickEstimate(price, downPaymentPercentage = 20, annualInterestRate = 6.5, termInYears = 20) {
  const downPayment = (downPaymentPercentage / 100) * price;
  const principal = price - downPayment;
  const monthlyRate = (annualInterestRate / 100) / 12;
  const totalMonths = termInYears * 12;

  if (principal <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;

  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                         (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return Math.round(monthlyPayment);
}


export function filterPropertiesBySearch(properties, filters) {
  if (!properties || !Array.isArray(properties)) return [];
  if (!filters) return properties;

  return properties.filter((property) => {
    // Search query matches title or description
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const titleMatch = property.title?.toLowerCase().includes(q);
      const descMatch = property.description?.toLowerCase().includes(q);
      const locMatch = property.location?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !locMatch) return false;
    }

    // City location match
    if (filters.city) {
      const cityFilter = filters.city.toLowerCase();
      if (!property.location?.toLowerCase().includes(cityFilter)) return false;
    }

    // Property Type match
    if (filters.propertyType && filters.propertyType !== 'All') {
      if (property.propertyType !== filters.propertyType) return false;
    }

    // Min Price match
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      if (!isNaN(min) && property.price < min) return false;
    }

    // Max Price match
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max) && property.price > max) return false;
    }

    return true;
  });
}
