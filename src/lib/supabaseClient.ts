import { createClient } from '@supabase/supabase-js'

// Bu fonksiyon artık doğrudan export edilmiyor, çünkü her bileşen kendi istemcisini hook ile alacak.
// Ancak bazı durumlarda genel bir istemciye ihtiyaç olabilir diye şimdilik tutuyoruz.
// ÖNEMLİ: Projenin .env dosyasındaki environment değişkenlerinin isimlerini
// VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY olarak değiştirdiğinden emin ol.
export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
) 