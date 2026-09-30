DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'image_url') THEN
    ALTER TABLE businesses ADD COLUMN image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'updated_at') THEN
    ALTER TABLE businesses ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'verified_at') THEN
    ALTER TABLE businesses ADD COLUMN verified_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'short_description') THEN
    ALTER TABLE businesses ADD COLUMN short_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'description') THEN
    ALTER TABLE businesses ADD COLUMN description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'website_url') THEN
    ALTER TABLE businesses ADD COLUMN website_url TEXT;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE;

DROP TRIGGER IF EXISTS set_businesses_updated_at ON businesses;
CREATE TRIGGER set_businesses_updated_at
BEFORE UPDATE ON businesses
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_updated_at();

INSERT INTO businesses (id, name, city_id, business_type, category_id, subcategory_id, address, lat, lng, phone, instagram, telegram, bale, whatsapp, neshan, hours, price_tier, is_supporter, status, is_verified, short_description, description, search_terms, social_links, created_at)
SELECT
  gen_random_uuid(),
  'باشگاه سوارکاری آفتاب',
  'mashhad',
  'physical',
  c.id,
  s.id,
  'مشهد، بلوار وکیل‌آباد',
  36.297,
  59.556,
  '09150000000',
  'aftab_equestrian',
  'aftab_equestrian',
  'aftab_equestrian',
  '989150000000',
  NULL,
  '۸ تا ۲۰',
  2,
  TRUE,
  'approved',
  TRUE,
  'مدرس سوارکاری حرفه‌ای با سوابق بین‌المللی',
  'باشگاه سوارکاری آفتاب با بهترین اسب‌ها و مربیان مجرب، آموزش سوارکاری مقدماتی تا پیشرفته را برای سنین مختلف ارائه می‌دهد. امکان رزرو ساعت خصوصی و گروهی موجود است.',
  ARRAY['اسب','سواری','سوارکاری','اسب‌سواری','لوازم سوارکاری']::TEXT[],
  '{}'::JSONB,
  now()
FROM categories c
LEFT JOIN subcategories s ON s.category_id = c.id AND s.slug = 'equestrian'
WHERE c.slug = 'sport'
AND NOT EXISTS (
  SELECT 1 FROM businesses b WHERE b.name = 'باشگاه سوارکاری آفتاب' AND b.city_id = 'mashhad'
)
LIMIT 1;

INSERT INTO businesses (id, name, city_id, business_type, category_id, subcategory_id, address, lat, lng, phone, instagram, telegram, bale, whatsapp, neshan, hours, price_tier, is_supporter, status, is_verified, short_description, description, search_terms, social_links, created_at)
SELECT
  gen_random_uuid(),
  'کافه نمور',
  'mashhad',
  'physical',
  c.id,
  s.id,
  'مشهد، احمدآباد',
  36.303,
  59.588,
  '05100000000',
  'namoor.cafe',
  'namoorcafe',
  'namoorcafe',
  '985100000000',
  NULL,
  '۹ تا ۲۳',
  1,
  FALSE,
  'approved',
  TRUE,
  'کافه و رستوران دنج با منوی متنوع',
  'کافه نمور در محله احمدآباد با محیط دوستانه و منوی متنوع شامل انواع کافه‌ترین، شام و دسر، مکان مناسبی برای گذران وقت با خانواده و دوستان است.',
  ARRAY['کافه','رستوران','کافه‌ترین','قهوه','شیرینی','کیک','صبحانه','شام']::TEXT[],
  '{}'::JSONB,
  now()
FROM categories c
LEFT JOIN subcategories s ON s.category_id = c.id AND s.slug = 'cafe'
WHERE c.slug = 'food'
AND NOT EXISTS (
  SELECT 1 FROM businesses b WHERE b.name = 'کافه نمور' AND b.city_id = 'mashhad'
)
LIMIT 1;

INSERT INTO businesses (id, name, city_id, business_type, category_id, subcategory_id, address, lat, lng, phone, instagram, telegram, bale, whatsapp, neshan, hours, price_tier, is_supporter, status, is_verified, short_description, description, website_url, search_terms, social_links, created_at, image_url)
SELECT
  gen_random_uuid(),
  'گو تو چاینا',
  'mashhad',
  'physical',
  c.id,
  s.id,
  NULL,
  NULL,
  NULL,
  '09172609276',
  NULL,
  NULL,
  NULL,
  NULL,
  'https://nshn.ir/77rb1-5c0JGUP0',
  'پاسخ‌گویی آنلاین',
  NULL,
  FALSE,
  'approved',
  TRUE,
  'موسسه مهاجرتی تحصیلی چین با بیش از ۱۰ سال تجربه',
  'گو تو چاینا، ارائه‌دهنده خدمات مهاجرتی تحصیلی به چین شامل: دریافت پذیرش از دانشگاه‌های برتر چین، ویزای دانشجویی، ترجمه مدارک، رزرو خوابگاه و خدمات قبل از سفر و پس از ورود به چین. بیش از ۱۰۰۰ دانشجوی موفق.',
  'https://go2china.ir',
  ARRAY['مهاجرت','چین','دانشگاه','ویزا','تحصیل در خارج','دانشجویی','پذیرش','موسسه مهاجرتی','تحصیلی']::TEXT[],
  '{
    "instagram": "https://www.instagram.com/go2china.ir",
    "telegram_group": "https://t.me/chinastudygp",
    "telegram_channel": "https://t.me/go2chinaa",
    "whatsapp": "https://wa.me/989172609276",
    "bale": "http://ble.ir/go2china"
  }'::JSONB,
  now(),
  '/go2china-sample.jpeg'
FROM categories c
LEFT JOIN subcategories s ON s.category_id = c.id AND s.slug = 'immigration-institute'
WHERE c.slug = 'immigration'
AND NOT EXISTS (
  SELECT 1 FROM businesses b WHERE b.name = 'گو تو چاینا' AND b.city_id = 'mashhad'
)
LIMIT 1;