import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp, Globe, ArrowRightLeft, Landmark, Coins } from 'lucide-react';

export default function FinanceCalculator() {
  const [activeSubTab, setActiveSubTab] = useState('mortgage'); // 'mortgage' | 'currency'

  // --- Mortgage State ---
  const [propertyPrice, setPropertyPrice] = useState(150000000); // Default XAF price
  const [downPayment, setDownPayment] = useState(30000000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(20);

  // Mortgage Calculations
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPrincipal, setTotalPrincipal] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    const principal = Math.max(0, propertyPrice - downPayment);
    const monthlyRate = (interestRate / 100) / 12;
    const totalMonths = loanTerm * 12;

    let monthly = 0;
    if (principal > 0) {
      if (monthlyRate === 0) {
        monthly = principal / totalMonths;
      } else {
        monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                  (Math.pow(1 + monthlyRate, totalMonths) - 1);
      }
    }

    const calculatedTotalPayment = monthly * totalMonths;
    const calculatedTotalInterest = Math.max(0, calculatedTotalPayment - principal);

    setMonthlyPayment(Math.round(monthly));
    setTotalPrincipal(principal);
    setTotalInterest(Math.round(calculatedTotalInterest));
    setTotalPayment(Math.round(calculatedTotalPayment));
  }, [propertyPrice, downPayment, interestRate, loanTerm]);

  // --- Currency Converter State ---
  const [sourceAmount, setSourceAmount] = useState(1000000); // 1,000,000 CFA default
  const [sourceCurrency, setSourceCurrency] = useState('XAF');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(0);

  // Hardcoded Exchange Rates (based on baseline conversions)
  const exchangeRates = {
    XAF: 1,           // Base currency
    NGN: 2.45,        // 1 CFA = 2.45 Naira
    KES: 0.21,        // 1 CFA = 0.21 Shillings
    USD: 0.0016,      // 1 CFA = 0.0016 Dollars
    EUR: 0.0015,      // 1 CFA = 0.0015 Euros
    GBP: 0.0013,      // 1 CFA = 0.0013 Pounds
  };

  const currencyNames = {
    XAF: 'Central African CFA Franc (Cameroon)',
    NGN: 'Nigerian Naira (Nigeria)',
    KES: 'Kenyan Shilling (Kenya)',
    USD: 'United States Dollar (USA)',
    EUR: 'Euro (France/Europe)',
    GBP: 'Great British Pound (UK)',
  };

  const currencySymbols = {
    XAF: 'FCFA',
    NGN: '₦',
    KES: 'KSh',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  useEffect(() => {
    // Convert source to XAF, then XAF to target
    const amountInXaf = sourceAmount / exchangeRates[sourceCurrency];
    const finalAmount = amountInXaf * exchangeRates[targetCurrency];
    setConvertedAmount(parseFloat(finalAmount.toFixed(2)));
  }, [sourceAmount, sourceCurrency, targetCurrency]);

  const handleSwapCurrencies = () => {
    const temp = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(temp);
    setSourceAmount(convertedAmount);
  };

  // Helper to format currency
  const formatValue = (value, currency = 'XAF') => {
    if (currency === 'XAF') {
      return `${Math.round(value).toLocaleString()} FCFA`;
    }
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalPercentage = totalPayment > 0 ? (totalPrincipal / totalPayment) * 100 : 0;

  return (
    <div id="propspace-finance-hub" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm max-w-4xl mx-auto my-4">
      {/* Decorative colored banner header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>
        
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
            <Calculator className="w-6 h-6 text-blue-100" />
          </div>
          <div>
            <span className="text-[10px] bg-blue-500/30 text-blue-100 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Smart PropTools
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">Worldwide Real Estate Finance Center</h2>
          </div>
        </div>
        <p className="text-blue-100/80 text-xs max-w-2xl">
          Empower your international search. Calculate real-time amortization paths and instantly convert listing values across central Cameroonian CFA, Nigerian Naira, Kenyan Shilling, and Western bluechip currencies.
        </p>

        {/* Tab Switcher */}
        <div className="flex space-x-2 mt-6 bg-slate-900/20 p-1 rounded-xl max-w-sm border border-white/10">
          <button
            onClick={() => setActiveSubTab('mortgage')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'mortgage'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Mortgage Estimator</span>
          </button>
          <button
            onClick={() => setActiveSubTab('currency')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'currency'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Currency Converter</span>
          </button>
        </div>
      </div>

      {/* Calculator Workspaces */}
      <div className="p-6 md:p-8">
        
        {/* VIEW A: Mortgage Estimator */}
        {activeSubTab === 'mortgage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input column */}
            <div className="lg:col-span-5 space-y-5">
              <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wide border-b pb-2">
                Estimate Loan parameters
              </h3>

              {/* Property Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex justify-between">
                  <span>Property Listing Value</span>
                  <span className="font-mono text-blue-650">{formatValue(propertyPrice)}</span>
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold text-xs">CFA</span>
                  </div>
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="block w-full pl-12 pr-4 py-2 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-sm font-semibold outline-none transition-all"
                  />
                </div>
                <input
                  type="range"
                  min="500000"
                  max="500000000"
                  step="500000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex justify-between">
                  <span>Down Payment (Equity contribution)</span>
                  <span className="font-mono text-emerald-650">{formatValue(downPayment)}</span>
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold text-xs">CFA</span>
                  </div>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(0, parseInt(e.target.value) || 0))}
                    className="block w-full pl-12 pr-4 py-2 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-sm font-semibold outline-none transition-all"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={propertyPrice}
                  step="250000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>

              {/* Grid term and rates */}
              <div className="grid grid-cols-2 gap-4">
                {/* Interest Rate */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center space-x-1">
                    <Percent className="w-3 h-3 text-slate-400" />
                    <span>Annual Rate</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="30"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 1))}
                    className="block w-full px-3 py-2 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-sm font-bold outline-none transition-all"
                  />
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Term (Years)</span>
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    className="block w-full px-3 py-2 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-sm font-bold outline-none transition-all"
                  >
                    <option value={5}>5 Years</option>
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calculations Result Column */}
            <div className="lg:col-span-7 bg-slate-50 rounded-xl p-5 md:p-6 border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide border-b pb-2 mb-4">
                  Amortization Summary
                </h3>

                <div className="mb-5 bg-blue-600 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <TrendingUp className="w-24 h-24" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Estimated Monthly Payment</span>
                  <div className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">{formatValue(monthlyPayment)}</div>
                  <p className="text-blue-100/70 text-[10px] mt-1">Based on a {loanTerm}-year term at {interestRate}% interest.</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-6">
                  <div className="bg-white p-3 rounded-lg border border-slate-200/65">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wide">Principal</span>
                    <span className="block text-xs font-bold text-slate-750 mt-1 truncate">{formatValue(totalPrincipal)}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/65">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wide">Total Interest</span>
                    <span className="block text-xs font-bold text-slate-750 mt-1 truncate">{formatValue(totalInterest)}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/65">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wide">Total Cost</span>
                    <span className="block text-xs font-bold text-blue-700 mt-1 truncate">{formatValue(totalPayment)}</span>
                  </div>
                </div>

                {/* Visual Ratio breakdown block */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide block mb-1.5">
                    Repayment Ratio (Principal vs Interest)
                  </span>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-500" 
                      style={{ width: `${principalPercentage}%` }}
                      title={`Principal: ${principalPercentage.toFixed(1)}%`}
                    ></div>
                    <div 
                      className="bg-amber-500 h-full transition-all duration-500" 
                      style={{ width: `${interestPercentage}%` }}
                      title={`Interest: ${interestPercentage.toFixed(1)}%`}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Principal ({principalPercentage.toFixed(0)}%)</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      <span>Interest ({interestPercentage.toFixed(0)}%)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200/70 pt-4 mt-4 text-[10px] text-slate-450 italic">
                * Rates are approximations for informational estimates. Consult with Cameroonian or localized international mortgage institutions for legal terms.
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: Currency Converter */}
        {activeSubTab === 'currency' && (
          <div className="max-w-2xl mx-auto py-4">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wide border-b pb-2 mb-6">
              Worldwide Currency Conversion Workspace
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-9 items-center gap-4">
              {/* Source Column */}
              <div className="md:col-span-4 space-y-2">
                <label className="block text-xs font-bold text-slate-500">From Currency</label>
                <select
                  value={sourceCurrency}
                  onChange={(e) => setSourceCurrency(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 hover:bg-slate-50/50 border border-slate-200 focus:border-blue-500 rounded-lg text-sm font-semibold outline-none transition-all mb-2"
                >
                  {Object.keys(exchangeRates).map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} - {currencyNames[curr]}
                    </option>
                  ))}
                </select>
                <div className="relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold text-sm">{currencySymbols[sourceCurrency]}</span>
                  </div>
                  <input
                    type="number"
                    value={sourceAmount}
                    onChange={(e) => setSourceAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg text-sm font-extrabold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Swap Button Column */}
              <div className="md:col-span-1 flex justify-center pt-5">
                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-full border border-blue-200 shadow-xs transition-all active:scale-90"
                  title="Swap Currencies"
                >
                  <ArrowRightLeft className="w-4 h-4 md:rotate-90" />
                </button>
              </div>

              {/* Target Column */}
              <div className="md:col-span-4 space-y-2">
                <label className="block text-xs font-bold text-slate-500">To Currency</label>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 hover:bg-slate-50/50 border border-slate-200 focus:border-blue-500 rounded-lg text-sm font-semibold outline-none transition-all mb-2"
                >
                  {Object.keys(exchangeRates).map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} - {currencyNames[curr]}
                    </option>
                  ))}
                </select>
                <div className="bg-slate-900 text-white rounded-lg px-4 py-2.5 border border-slate-800 text-sm font-extrabold flex items-center justify-between min-h-[44px]">
                  <span>{currencySymbols[targetCurrency]}</span>
                  <span className="font-mono">{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Reference Table Panel */}
            <div className="mt-8 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block mb-3">
                Live Conversion Index (Relative to 1,000,000 CFA)
              </span>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                {Object.keys(exchangeRates).map((curr) => {
                  if (curr === 'XAF') return null;
                  const amtInCurr = (1000000 / exchangeRates['XAF']) * exchangeRates[curr];
                  return (
                    <div key={curr} className="bg-white p-2.5 rounded-lg border border-slate-200/50">
                      <span className="block text-[10px] text-slate-400 font-bold">{curr}</span>
                      <span className="block text-xs font-extrabold text-slate-800 mt-1">
                        {formatValue(amtInCurr, curr)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 italic text-center mt-4">
                * Daily baseline updates. Cross rates correspond to general interbank ranges for Central/West Africa and global reserves.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
