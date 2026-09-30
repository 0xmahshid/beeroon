# گزارش Audit پروژه بیرون (Beeroon) — ۲۹ سپتامبر ۲۰۲۶

## جمع‌بندی وضعیت فعلی

ریپو `0xmahshid/beeroon` با Next.js 15 + Tailwind + Supabase ساخته شده. آخرین کامیت `4bf5e31` با پیام «Complete P0 discovery backend hardening». نسخه زنده روی `beeroon.vercel.app`.

---

## قابلیت‌های آماده (در کد واقعاً وجود دارند)

| قابلیت | وضعیت | محل پیاده‌سازی |
|---|---|---|
| UI RTL فارسی با هویت بصری مشخص | ✅ آماده | `app/globals.css`، `tailwind.config.js` |
| انتخاب شهر و ذخیره در URL query param | ✅ آماده | `components/CityPicker.tsx` |
| انتخاب محله (۱۷ محله seed) | ⚠️ آماده ولی از hardcoded | `components/NeighborhoodPicker.tsx` + `lib/neighborhoods.ts` |
| جست‌وجوی ساده نام/دسته/جست‌وجوی terms | ✅ آماده | `lib/data.ts` → `relevance()` |
| نرمال‌سازی اولیه ی/ي و ک/ك | ⚠️ در دو جا تکراری | `lib/data.ts` + `lib/search-intent.ts` |
| SEARCH_INTENTS برای ۷ حوزه | ✅ آماده | `lib/search-intent.ts` |
| کارت کسب‌وکار با فاصله + تماس + مسیریابی | ✅ آماده | `components/BusinessCard.tsx` |
| صفحه جزئیات کسب‌وکار | ✅ آماده | `app/business/[id]/page.tsx` |
| ثبت کسب‌وکار جدید (pending) | ✅ آماده | `app/register-business/page.tsx` |
| پنل ادمین (Supabase Auth) | ✅ آماده | `app/admin/**` + `middleware.ts` |
| API گزارش اطلاعات اشتباه | ✅ آماده | `app/api/reports/route.ts` |
| API ثبت analytics events | ✅ آماده | `app/api/events/route.ts` |
| جدول neighborhoods در دیتابیس | ✅ آماده | `migrations/20260929000000_local_discovery.sql` |
| ۱۷ محله seed در Supabase migration | ✅ آماده | `migrations/20260930100000_p0_discovery_hardening.sql` |
| جدول business_reports + RLS | ✅ آماده | همان migration بالا |
| RLS برای جدول‌های اصلی (cities/categories/subcategories/businesses) | ✅ آماده | `supabase/schema.sql` |
| محاسبه فاصله Haversine | ✅ آماده | `lib/data.ts` → `distanceKm()` |
| Ranking اولیه (relevance → verified → distance → name) | ⚠️ ناقص | `lib/data.ts` → `rankBusinesses()` |
| business_type physical/online_shop | ✅ آماده | schema + RLS |
| Supabase Storage برای عکس (ImageUploadField) | ✅ آماده | `components/ImageUploadField.tsx` |

---

## قابلیت‌های ناقص یا نیازمند تکمیل

### P0 — هسته کشف محلی

| بند | مشکل | ریسک | اولویت |
|---|---|---|---|
| P0.1 — انتخاب محله | `NeighborhoodPicker` و `getNeighborhoods` از فایل hardcoded `lib/neighborhoods.ts` می‌خوانند نه از `public.neighborhoods` در Supabase | اگر محله‌ای در دیتابیس اضافه شود، در UI ظاهر نمی‌شود | 🔴 بالا |
| P0.1 — حفظ در localStorage/cookie | شهر و محله فقط در URL ذخیره می‌شوند، در localStorage یا cookie کاری نمی‌شود | در refresh/reopen کاربر، شهر/محله از بین می‌رود اگر URL لینک مستقیم نباشد | 🟡 متوسط |
| P0.1 — URL path | شهر/محله فقط در query string هستند نه در path (مثلاً `/mashhad/ahmadabad`) | URL خوانا و shareable کامل نیست | 🟡 متوسط |
| P0.1 — validation مسیر نامعتبر | redirect یا 404 برای city/neighborhood نامعتبر نداریم | 🟡 متوسط | |
| P0.2 — نرمال‌سازی فارسی | تابع `normalizePersian` در `lib/data.ts` و `normalize` در `lib/search-intent.ts` **دو کپی جداگانه** هستند؛ no single source of truth؛ no tests | اختلاف رفتار بین intent و جست‌وجو؛ bugs در edge cases | 🔴 بالا |
| P0.3 — جست‌وجو در backend | `getBusinesses` همه رکوردهای شهر را از Supabase می‌کشد (`*` + online_shop_details) و در Next.js ranking/فیلتر می‌کند | با رشد داده به O(n) تبدیل می‌شود؛ SQL injection اگر پارامترها بی‌دقت باشند (فعلاً parametrized است اما scaling ضعیف) | 🔴 بالا |
| P0.3 — pagination | جست‌وجو pagination ندارد | ۱۰۰+ نتیجه → UX بد و performance بد | 🟡 متوسط |
| P0.3 — دلیل ارتباط | کارت چاپ نمی‌کند «چرا این نتیجه برای جست‌وجوی تو مرتبط است» | کاربر اعتماد نمی‌کند که نتیجه مرتبط است | 🟡 متوسط |
| P0.3 — neighborhood filter در SQL | در configured mode، `getBusinesses` فقط `city_id` را در query Supabase فیلتر می‌کند؛ `neighborhood_slug` اصلاً در SQL filter نیست، همه businesses شهر را می‌کشد و بعد در FE ranking می‌کند | داده‌های زیاد → بسیار کند | 🔴 بالا |
| P0.4 — فرمول رتبه‌بندی کامل | فرمول `score = 0.40*relevance + 0.25*distance + 0.12*open_now + 0.10*completeness + 0.08*verified + 0.05*freshness` **اصلاً پیاده‌سازی نشده**؛ فعلاً فقط ترتیب ساده است | نتایج بر اساس اولویت‌های محصول مرتب نمی‌شوند | 🔴 بالا |
| P0.4 — open_now | منطق باز/بسته بر اساس hours + timezone ایران **وجود ندارد**؛ `hours` فقط string است | «باز است» در کارت نمی‌آید | 🔴 بالا |
| P0.4 — profile_completeness | محاسبه نمی‌شود؛ فیلد در businesses هم نیست | ranking از دست می‌رود؛ کاربر نمی‌کدام پروفایل کامل است | 🟡 متوسط |
| P0.4 — verified وزن | `is_verified` در ranking نقطه‌بین فاصله و نام می‌آید؛ وزن‌گذاری دقیق انجام نمی‌شود | 🟡 متوسط | |
| P0.4 — freshness | `updated_at`/last_verified فیلد نداریم و در ranking نیست | 🟢 پایین | |
| P0.4 — Filters UI | نزدیک‌ترین/مرتبط‌ترین/باز/تأییدشده/خرید حضوری فیلتر در UI نداریم | فقط در business plan هستند | 🟡 متوسط |
| P0.5 — Work hours در card | hours فقط string است، parse نمی‌شود؛ «باز/بسته» به صورت realtime محاسبه نمی‌شود | کاربر نمی‌داند الان باز است یا نه | 🔴 بالا |
| P0.5 — دلیل ارتباط در کارت | نمی‌گوید «چرا مرتبط است» | 🟡 متوسط | |
| P0.5 — Report دکمه در کارت/جزئیات | API وجود دارد ولی UI report در جزئیات نیست | کاربر نمی‌تواند گزارش اشتباه بدهد | 🔴 بالا |
| P0.5 — «این کسب‌وکار مال من است» در صفحه جزئیات | وجود ندارد | claim path وجود ندارد | 🟡 متوسط (P1 است ولی در P0 دیده می‌شود) |
| P0.5 — structured data / SEO metadata | صفحه business metadata خاصی ندارد؛ OG یکسان برای همه است | SEO محصولی ضعیف | 🟡 متوسط |
| P0.7 — search و search_no_results event | وقتی کاربر جست‌وجو می‌کند، event `search` و وقتی نتیجه نیست `search_no_results` ثبت نمی‌شود | analytics ناقص | 🔴 بالا |
| P0.7 — anonymous_session_id | در جدول analytics_events فیلد `anonymous_session_id` نیست و درج نمی‌شود | نمی‌توان رویدادهای یک session را جمع کرد | 🟡 متوسط |
| P0.7 — search_id | در analytics_events فیلد `search_id` نیست؛ نمی‌توان کلیک‌های یک جست‌وجو را به query مرتبط کرد | attribution analytics از بین می‌رود | 🟡 متوسط |
| P0.7 — view_business event | صفحه جزئیات event ثبت نمی‌کند | 🟡 متوسط | |
| P0.8 — no-results state | state خالی داریم ولی پیشنهاد «نتیجه نزدیک»، «تغییر محله»، «ثبت درخواست دسته» کافی نیست (فقط دکمه ثبت کسب‌وکار هست) | 🟢 پایین | |
| P0.9 — business_reports فیلدهای کمبود | `page/source` (از کدام صفحه گزارش آمده)، `anonymous_session_id` نداریم | بررسی گزارش در ادمین سخت‌تر است | 🟡 متوسط |

### P1 — پنل مالک و ادمین

| بند | مشکل | اولویت |
|---|---|---|
| RLS ادمین | Policyهای `admin read/write` در schema به کل `authenticated` اجازه می‌دهند؛ نه فقط به کاربران با `app_metadata.role === 'admin'`. Middleware فقط route را محافظت می‌کند ولی کسی که مستقیماً supabase API را بزند (و user داشته باشد) می‌تواند همه کسب‌وکارها را ببیند/ویرایش کند | 🔴 بالا (امنیت) |
| پنل مدیریت شهر/محله/دسته/مترادف | در admin/dashboard وجود ندارد | 🟡 متوسط |
| duplicate detection در ثبت کسب‌وکار | نیست | 🟡 متوسط |
| ownership claim | كامل وجود ندارد | 🟡 متوسط |
| owner panel | كامل وجود ندارد | 🟡 متوسط |

### P2 — Pro و پرداخت

کلاً در دیتابیس و کد وجود ندارند (جدول‌های subscriptions، payments، business_services، business_images، business_owners در schema نیستند).

---

## باگ‌های مهم (با اثر فوری)

1. **NeighborhoodPicker از Supabase نمی‌خواند** → اگر در Supabase محله اضافه شود، UI آن را نمی‌بیند. (P0.1)
2. **neighborhood_slug فیلتر در query Supabase نیست** → همه کسب‌وکارهای شهر کشیده می‌شوند، بعد در FE فیلتر/ranking. با رشد داده، latency به شدت بالا می‌رود + cost Supabase. (P0.3)
3. **Duplicate normalize helpers** → هر جا کپی شده و احتمالاً sync نیستند. اگر fixای در یکی رفت دیگری update نمی‌شود. (P0.2)
4. **RLS policy برای authenticated خیلی گسترده است** → هر authenticated user (نه فقط admin) می‌تواند با Supabase client همه businesses را ببیند و update و delete کند. Middleware فقط frontend route را مسدود می‌کند ولی data layer محافظت نشده. (امنیت)
5. **open_now + hours parse نشده** → کاربر نمی‌داند الان باز است یا نه. (P0.4)
6. **search و search_no_results ثبت نمی‌شوند** → نمی‌دانیم کاربر چقدر نتیجه پیدا می‌کند. (P0.7)
7. **Report UI در صفحه جزئیات نیست** → report feature فقط API است، کاربر قابل استفاده نیست. (P0.9)

---

## ریسک‌های دیتابیس

| ریسک | توضیح |
|---|---|
| فیلدهای کمبود در businesses | `neighborhood_id` (به جای slug)، `slug`، `search_text`، `search_text_normalized`، `short_description`، `description`، `website_url`، `logo_url`، `verified_at`، `verified_method`، `claimed_by`، `profile_completeness`، `updated_by_owner_at`، `last_verified_at` در schema نیستند. فعلاً `neighborhood_slug` و `is_verified` و `search_terms` اضافه شده‌اند |
| جدول‌های P1/P2 وجود ندارند | `business_services`، `business_images`، `business_owners`، `subscriptions`، `payments`، `synonyms` (intent ها در جدول نیستند، در code هستند) |
| analytics_events فیلدهای کمبود | `search_id`، `anonymous_session_id`، `city_id` (به جای city text)، `neighborhood_id` (به جای neighborhood text). فعلاً query, city, neighborhood text هستند |
| business_reports فیلدهای کمبود | `page_source`، `anonymous_session_id` |
| foreign key ناقص | `neighborhood_slug` در businesses فیلد است ولی FK به جدول neighborhoods ندارد (چون neighborhoods slug + city_id unique است؛ بهتر بود FK داشته باشد) |
| No index در search_text_normalized | چون فیلد نداریم |
| synonym / intent در جدول نیستند | اگر ادمین بخواهد جدید اضافه کند باید کد را تغییر دهد و deploy کند |

---

## ریسک‌های امنیتی

| ریسک | توضیح | شدت |
|---|---|---|
| **RLS ادمین ناقص** | همه policyهای admin برای `authenticated` هستند نه فقط `admin role`. Middleware routes را مسدود می‌کند اما data layer باز است | 🔴 Critical |
| No rate limiting در /api/events و /api/reports | می‌تواند spam شود و دیتابیس را پر کند | 🟡 متوسط |
| No input validation با Zod در API routes | فقط primitive checkها هست، Zod یا joi نیست | 🟡 متوسط |
| No CSP / security headers در next.config | فعلاً default Next. Open redirect/XSS ممکن باشد اگر URLها validate نشوند (فعلاً social links sanitized هستند ولی formal نیست) | 🟢 پایین |
| analytics_events insert policy "with check (true)" | خیلی آزاد است — حداقل باید length limit داشته باشد | 🟡 متوسط |
| No CSRF protection در API routes چون POST JSON هستند ولی csrf token نداریم | فعلاً risk پایین چون SameSite cookies و Next.js، ولی formal نیست | 🟢 پایین |
| Secret در کد نباشد — فعلاً به نظر می‌رسد env varها هستند | good | 🟢 |

---

## ریسک‌های Deployment

| ریسک | توضیح |
|---|---|
| Migrationها در کد هستند ولی باید روی Supabase واقعی `zdqvkrarnditnzbfrmsvi` verify شوند | کاربر تأیید کرده migration P0 اجرا شده ولی باید باز هم چک شود |
| Vercel `POSTGRES_*` می‌تواند به دیتابیس جداگانه متصل باشد؛ دیتابیس اصلی Supabase است | باید env را چک کرد |
| .env.example وجود ندارد → کاربر جدید نمی‌داند چه متغیرهایی لازم دارد | باید ساخته شود |
| No unit tests → نمی‌دانیم بعد از تغییر چی می‌شکند | باید minimum tests اضافه شود |
| No build / typecheck / lint اجرا شده در این لحظه | باید قبل از deploy اجرا شود |

---

## اولویت اجرای کارها (از بالا به پایین)

### فوریت بسیار بالا (قبل از هر چیزی)

1. ✅ **ثبت گزارش audit** (همین فایل)
2. 🔴 **اصلاح RLS policyها** — admin فقط با `app_metadata.role = 'admin'` بتواند نوشتن/خواندن همه رکوردها را انجام دهد. (امنیت)
3. 🔴 **ساختن utility مرکزی normalize فارسی** (`lib/persian.ts` یا `lib/normalize.ts`) و انتقال همه جا به آن. (P0.2)
4. 🔴 **خواندن neighborhoods از Supabase** (نه از فایل hardcoded) در `lib/data.ts` و `NeighborhoodPicker`. (P0.1)
5. 🔴 **اعمال neighborhood_slug در SQL query** (نه فقط FE). کاهش O(n) به O(1). (P0.3)

### بالا — P0 هسته

6. 🔴 **فرمول کامل ranking** با weights در یک فایل ثابت (`lib/ranking.ts`) و استفاده همگانی. (P0.4)
7. 🔴 **منطق open_now + parse ساعات کاری** با timezone ایران. (P0.6)
8. 🔴 **ثبت events search, search_no_results, view_business** + معرفی `anonymous_session_id` (localStorage) + `search_id` (per query) در analytics. (P0.7)
9. 🔴 **UI گزارش اطلاعات اشتباه در صفحه جزئیات** business. (P0.9)
10. 🔴 **profile_completeness** محاسبه و نمایش. (P0.4)
11. 🟡 **ذخیره شهر/محله در localStorage/cookie** + خواندن پیش‌فرض از آنجا. (P0.1)
12. 🟡 **دلیل ارتباط در کارت** (چرا مرتبط است). (P0.3)
13. 🟡 **URL validation** برای city/neighborhood نامعتبر + redirect. (P0.1)
14. 🟡 **Pagination** در نتایج جست‌وجو. (P0.3)
15. 🟡 **SEO metadata اختصاصی** برای هر صفحه کسب‌وکار + canonical + structured data. (P1 SEO)

### متوسط

16. 🟡 **Filters UI** (نزدیک‌ترین، مرتبط‌ترین، باز، تأییدشده، خرید حضوری).
17. 🟡 **Rate limiting + validation** در API routes.
18. 🟡 **بهبود no-results state** (پیشنهاد تغییر محله، درخواست دسته جدید).
19. 🟡 **Unit tests** برای normalize، ranking، open_now، RLS scenarios.
20. 🟡 **Migration** فیلدهای کمبود businesses و analytics_events و reports.

### بعدی

21. پنل ادمین برای مدیریت شهر/محله/دسته/intent.
22. Ownership claim و owner panel.
23. Synonym/intent در جدول دیتابیس (قابل مدیریت توسط ادمین بدون deploy).
24. Pro subscription + payment (بعد از داده conversion واقعی طبق business plan).
25. Sitemap پویا + robots.

---

## ملاحظات

- UI فعلی خوب و RTL و موبایل‌محور است؛ نیازی به تغییر کامل نیست. فقط gapها پر شوند.
- Hamesha remember: دیتابیس اصلی Supabase است نه Vercel Postgres.
- هیچ secretی در repo commit نشود؛ PATها و keys فقط در env و Supabase/Vercel بمانند.
- Business plan می‌گوید Pro نباید ranking را خراب کند → ranking weights ثابت هستند و Pro فقط UI/SEO/گالری بهتر می‌دهد؛ خرد نکنیم.
- «نتیجه اصلی کسب‌وکار است نه محصول» — در هیچ کجای search محصولات را مستقل نمایش ندهیم؛ فقط به عنوان سیگنال برای reason-of-match.

---

وضعیت نهایی قبل از شروع پیاده‌سازی: **حدوداً ۵۰٪ هسته P0 آماده، ۵۰٪ باقی نیاز دارد.** مهم‌ترین موارد RLS امنیتی + duplicate normalize + neighborhoods از DB + ranking کامل هستند که این فاز در اولویت قرار می‌گیرند.
