'use client';

import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Country {
  id: string;
  name: string;
  flag: string;
  center: number[];
  zoom: number;
  status: string;
  alerts: number;
  description: string;
  partner: string;
}

interface CountrySelectorProps {
  countries: Country[];
  selected: Country;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

export default function CountrySelector({ 
  countries, 
  selected, 
  onSelect, 
  onClose 
}: CountrySelectorProps) {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26, 26, 46, 0.85)' }}
    >
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-kenya-black via-forest-900 to-kenya-black text-white p-5 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl">Select Region</h2>
              <p className="text-forest-300 text-sm mt-1">
                Leicester PyEO Research Coverage
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-xl transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Countries List */}
        <div className="p-4 space-y-3">
          {/* Active Countries */}
          <div className="mb-4">
            <p className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-forest-500 rounded-full"></span>
              Active Monitoring
            </p>
            {countries.filter(c => c.status === 'active').map(country => (
              <button
                key={country.id}
                onClick={() => onSelect(country)}
                className={`w-full p-4 rounded-xl text-left transition-all mb-2 ${
                  selected.id === country.id
                    ? 'bg-forest-100 border-2 border-forest-500'
                    : 'bg-earth-50 border-2 border-transparent hover:border-earth-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <p className="font-bold text-kenya-black">{country.name}</p>
                      <p className="text-xs text-earth-600">{country.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {country.alerts > 0 && (
                      <span className="bg-maasai-500 text-white text-sm font-bold px-2.5 py-1 rounded-full">
                        {country.alerts}
                      </span>
                    )}
                    {selected.id === country.id && (
                      <CheckIcon className="w-6 h-6 text-forest-600" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Research Phase Countries */}
          <div className="mb-4">
            <p className="text-xs font-bold text-sunset-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-sunset-500 rounded-full"></span>
              Research Phase
            </p>
            {countries.filter(c => c.status === 'research' || c.status === 'pilot').map(country => (
              <button
                key={country.id}
                onClick={() => onSelect(country)}
                className={`w-full p-4 rounded-xl text-left transition-all mb-2 ${
                  selected.id === country.id
                    ? 'bg-sunset-50 border-2 border-sunset-400'
                    : 'bg-earth-50 border-2 border-transparent hover:border-earth-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <p className="font-bold text-kenya-black">{country.name}</p>
                      <p className="text-xs text-earth-500">{country.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-earth-200 text-earth-600 px-2 py-1 rounded-full">
                      {country.status === 'pilot' ? 'Pilot' : 'Coming Soon'}
                    </span>
                    {selected.id === country.id && (
                      <CheckIcon className="w-6 h-6 text-sunset-600" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-earth-100 p-4 rounded-xl mt-4">
            <p className="text-sm text-earth-700">
              <strong className="text-forest-700">Forest Alert</strong> can be deployed to any region 
              where Leicester's PyEO system is operational. Contact us about expanding coverage.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-earth-100 px-4 py-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-forest-700 to-forest-800 text-white py-3 rounded-xl hover:from-forest-600 hover:to-forest-700 transition font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}