import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../integrations/supabase/client';
import LawFirmCard from '../components/LawFirmCard';
import { Tables } from '../integrations/supabase/types';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';

const RehberPage: React.FC = () => {
  const [lawFirms, setLawFirms] = useState<Tables<'law_firm_profiles'>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchLawFirms = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('law_firm_profiles')
          .select('*')
          .eq('status', 'approved');
        if (error) throw error;
        setLawFirms((data ?? []) as Tables<'law_firm_profiles'>[]);
      } catch (err) {
        setError('Hukuk büroları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchLawFirms();
  }, []);

  // Şehirleri dinamik olarak oluştur
  const cities = useMemo(() => {
    const unique = Array.from(new Set(lawFirms.map(firm => firm.city)));
    return unique.sort();
  }, [lawFirms]);

  // Filtrelenmiş listeyi hesapla
  const filteredFirms = useMemo(() => {
    return lawFirms.filter(firm => {
      const cityMatch = !selectedCity || firm.city === selectedCity;
      const nameMatch = firm.name.toLowerCase().includes(searchTerm.toLowerCase());
      return cityMatch && nameMatch;
    });
  }, [lawFirms, selectedCity, searchTerm]);

  const handleCityChange = (value: string) => {
    if (value === "all") {
      setSelectedCity("");
    } else {
      setSelectedCity(value);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 px-2">
      <div className="w-full max-w-4xl flex flex-col items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Artiklo Onaylı Hukuk Büroları</h1>
        {/* Filtre UI */}
        <div className="flex flex-col md:flex-row gap-4 mb-2 w-full justify-center items-center">
          <div className="w-full md:w-60">
            <Select value={selectedCity || "all"} onValueChange={handleCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Şehre göre filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Şehirler</SelectItem>
                {cities
                  .filter(city => city && city.trim() !== "")
                  .map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-80">
            <Input
              type="text"
              placeholder="Firma adına göre ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFirms.map((firm) => (
            <LawFirmCard key={firm.id} firm={firm} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RehberPage; 