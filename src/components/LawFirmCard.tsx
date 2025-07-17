import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { Tables } from '../integrations/supabase/types';

interface LawFirmCardProps {
  firm: Tables<'law_firm_profiles'>;
}

const LawFirmCard: React.FC<LawFirmCardProps> = ({ firm }) => {
  return (
    <Link to={`/rehber/${firm.slug}`} className="block hover:shadow-lg transition-shadow">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-col items-center">
          {firm.logo_url && (
            <img
              src={firm.logo_url}
              alt={firm.name + ' logo'}
              className="w-20 h-20 object-contain mb-2 rounded-full bg-gray-100"
            />
          )}
          <CardTitle className="text-center text-lg">{firm.name}</CardTitle>
          <CardDescription className="text-center">{firm.city}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 justify-center mt-2">
          {firm.specialties && firm.specialties.length > 0 &&
            firm.specialties.map((spec, i) => (
              <Badge key={i} variant="secondary">{spec}</Badge>
            ))}
        </CardContent>
      </Card>
    </Link>
  );
};

export default LawFirmCard; 