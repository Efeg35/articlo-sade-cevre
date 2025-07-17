import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const RehberDetayPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [firm, setFirm] = useState<Tables<'law_firm_profiles'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchFirm = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('law_firm_profiles')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        setFirm(data as Tables<'law_firm_profiles'>);
      } catch (err) {
        setError('Hukuk bürosu bulunamadı veya bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchFirm();
  }, [slug]);

  if (loading) return <div className="py-10 text-center">Yükleniyor...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!firm) return <div className="py-10 text-center">Hukuk bürosu bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 px-2">
      <div className="w-full max-w-2xl flex flex-col items-center mb-8">
        <div className="w-full flex items-center mb-4">
          <Link to="/rehber">
            <Button variant="ghost" size="sm" className="pl-0">
              &larr; Tüm hukuk bürolarına dön
            </Button>
          </Link>
        </div>
        {firm.logo_url && (
          <img src={firm.logo_url} alt={firm.name + ' logo'} className="w-28 h-28 object-contain rounded-full bg-gray-100 mb-4" />
        )}
        <h1 className="text-3xl font-bold mb-2 text-center">{firm.name}</h1>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {firm.specialties && firm.specialties.length > 0 &&
            firm.specialties.map((spec, i) => (
              <Badge key={i} variant="secondary">{spec}</Badge>
            ))}
        </div>
        <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
          <div className="mb-2"><b>Şehir:</b> {firm.city}</div>
          {firm.address && <div className="mb-2"><b>Adres:</b> {firm.address}</div>}
          {firm.phone && <div className="mb-2"><b>Telefon:</b> <a href={`tel:${firm.phone}`} className="text-blue-600 underline">{firm.phone}</a></div>}
          {firm.email && <div className="mb-2"><b>E-posta:</b> <a href={`mailto:${firm.email}`} className="text-blue-600 underline">{firm.email}</a></div>}
          {firm.website && <div className="mb-2"><b>Web:</b> <a href={firm.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{firm.website}</a></div>}
        </div>
        {firm.description && <p className="text-base text-gray-700 text-center whitespace-pre-line">{firm.description}</p>}
      </div>
    </div>
  );
};

export default RehberDetayPage; 