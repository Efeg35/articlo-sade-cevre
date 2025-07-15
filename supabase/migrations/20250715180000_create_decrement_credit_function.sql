-- Kullanıcının kredisi atomik olarak 1 azalsın
create or replace function decrement_credit(user_id_param uuid)
returns void as $$
begin
  update profiles set credits = credits - 1 where id = user_id_param and credits > 0;
end;
$$ language plpgsql; 