-- =========================
-- DELETE ALL TABLES DATA BOT TABLES ITSELF
-- =========================
truncate table project_logs cascade;
truncate table project_stages cascade;
truncate table projects cascade;
truncate table workflow_template_stages cascade;
truncate table workflow_templates cascade;
truncate table users cascade;
truncate table clients cascade;




-- =========================
-- SEED DATA FOR ERP SYSTEM
-- =========================

-- 1️⃣ Clients
insert into clients (name, phone, type)
values
('شركة الأرض الذهبية', '0555555555', 'company');

-- =========================
-- 2️⃣ Users (Temporary)
insert into users (id, name, role)
values
(gen_random_uuid(), 'أحمد المساح', 'SURVEYOR'),
(gen_random_uuid(), 'محمد معماري', 'ARCHITECT');

-- =========================
-- 3️⃣ Workflow Template
insert into workflow_templates (project_type, name)
values
('BUILDING_PERMIT', 'رخصة بناء قياسية');

-- =========================
-- 4️⃣ Workflow Template Stages
insert into workflow_template_stages (template_id, name, stage_order)
values
(
  (select id from workflow_templates where project_type = 'BUILDING_PERMIT'),
  'الرفع المساحي',
  1
),
(
  (select id from workflow_templates where project_type = 'BUILDING_PERMIT'),
  'تسجيل الصك',
  2
),
(
  (select id from workflow_templates where project_type = 'BUILDING_PERMIT'),
  'التصميم المعماري',
  3
),
(
  (select id from workflow_templates where project_type = 'BUILDING_PERMIT'),
  'التصميم الإنشائي',
  4
),
(
  (select id from workflow_templates where project_type = 'BUILDING_PERMIT'),
  'تصميم الواجهات',
  5
),
(
  (select id from workflow_templates where project_type = 'BUILDING_PERMIT'),
  'التصاميم الميكانيكية',
  6
),
(
  (select id from workflow_templates where project_type = 'BUILDING_PERMIT'),
  'إعداد ملف بلدي',
  7
),
(
  (select id from workflow_templates where project_type = 'BUILDING_PERMIT'),
  'تقديم الطلب في بلدي',
  8
);

-- =========================
-- 5️⃣ Project (Trigger will create stages)
insert into projects (
  name,
  type,
  land_plot_number,
  land_location,
  server_path,
  client_id
)
values
(
  'شركة الأرض الذهبية - رخصة بناء',
  'BUILDING_PERMIT',
  '4385',
  'مخطط ولي العهد - البلوك 4',
  '\\Server\\Projects\\47\\GoldenLand',
  (select id from clients limit 1)
);
