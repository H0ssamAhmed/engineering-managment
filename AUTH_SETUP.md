# إعداد نظام المصادقة (Authentication Setup)

## المتطلبات

1. **Supabase Project** مع جدول `users` يحتوي على: `id`, `name`, `role`, `is_active`, `email`
2. **Supabase Auth** مفعّل للإيميل وكلمة المرور

## خطوات الإعداد

### 1. تشغيل الـ Migration

نفّذ الـ migration لإضافة عمود `email` و `is_active` إن لم يكونا موجودين:

```sql
-- في Supabase SQL Editor
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
```

### 2. إنشاء أول مستخدم (مدير)

في Supabase Dashboard:

1. اذهب إلى **Authentication** → **Users** → **Add user** → **Create new user**
2. أدخل البريد الإلكتروني وكلمة المرور
3. انسخ الـ User ID المعروض

4. في **SQL Editor** نفّذ:

```sql
INSERT INTO users (id, name, email, role, is_active)
VALUES (
  'USER_ID_FROM_STEP_3',
  'اسم المدير',
  'manager@example.com',
  'MANAGER',
  true
);
```

### 3. نشر Edge Function (لإضافة المستخدمين)

```bash
# تثبيت Supabase CLI إن لم يكن مثبتاً
npm install -g supabase

# تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref YOUR_PROJECT_REF

# نشر الـ function
supabase functions deploy create-user
```

## الصلاحيات

- **تسجيل الدخول**: أي مستخدم موجود في `auth.users` ومنسق في `users`
- **إضافة موظف جديد**: فقط المستخدمون بدور `MANAGER` (مدير المكتب)
