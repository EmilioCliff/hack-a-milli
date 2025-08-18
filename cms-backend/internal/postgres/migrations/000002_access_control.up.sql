CREATE TABLE "casbin_rule" (
  "id" text NOT NULL PRIMARY KEY,
  "ptype" text, 
  "v0" text, 
  "v1" text, 
  "v2" text, 
  "v3" text, 
  "v4" text, 
  "v5" text
);

CREATE TABLE "rbac_resources" (
  "id" bigserial PRIMARY KEY,
  "name" varchar(100) UNIQUE NOT NULL, -- e.g., 'users', 'blogs', 'events', 'products'
  "description" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "rbac_actions" (
  "id" bigserial PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL, -- e.g., 'create', 'read', 'update', 'delete', 'publish'
  "description" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "rbac_roles" (
  "id" bigserial PRIMARY KEY,
  "name" varchar(100) UNIQUE NOT NULL, -- e.g., 'admin', 'editor', 'moderator', 'staff'
  "description" text NOT NULL,
  "is_system_role" boolean NOT NULL DEFAULT false, -- prevents deletion of core roles
  "is_active" boolean NOT NULL DEFAULT true,
  "created_by" bigint NOT NULL,
  "updated_by" bigint NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "rbac_roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id"),
  CONSTRAINT "rbac_roles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id")
);

-- Permissions: what actions can be performed on what resources
CREATE TABLE "rbac_permissions" (
  "id" bigserial PRIMARY KEY,
  "resource_id" bigint NOT NULL,
  "action_id" bigint NOT NULL,
  "description" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "rbac_permissions_unique" UNIQUE ("resource_id", "action_id"),
  CONSTRAINT "rbac_permissions_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "rbac_resources" ("id"),
  CONSTRAINT "rbac_permissions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "rbac_actions" ("id")
);

-- Role-Permission assignments
CREATE TABLE "rbac_role_permissions" (
  "role_id" bigint NOT NULL,
  "permission_id" bigint NOT NULL,
  "granted_by" bigint NOT NULL,
  "granted_at" timestamptz NOT NULL DEFAULT (now()),

  PRIMARY KEY ("role_id", "permission_id"),
  CONSTRAINT "rbac_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "rbac_roles" ("id"),
  CONSTRAINT "rbac_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "rbac_permissions" ("id"),
  CONSTRAINT "rbac_role_permissions_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users" ("id")
);

-- User-Role assignments
CREATE TABLE "rbac_user_roles" (
  "user_id" bigint NOT NULL,
  "role_id" bigint NOT NULL,
  "assigned_by" bigint NOT NULL,
  "assigned_at" timestamptz NOT NULL DEFAULT (now()),
  "expires_at" timestamptz NULL, -- optional role expiration

  PRIMARY KEY ("user_id", "role_id"),
  CONSTRAINT "rbac_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
  CONSTRAINT "rbac_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "rbac_roles" ("id"),
  CONSTRAINT "rbac_user_roles_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users" ("id")
);

CREATE TABLE "rbac_audit_log" (
  "id" bigserial PRIMARY KEY,
  "action" varchar(50) NOT NULL, -- 'role_created', 'permission_granted', 'user_assigned_role', etc.
  "entity_type" varchar(50) NOT NULL, -- 'role', 'permission', 'user_role'
  "entity_id" bigint NOT NULL,
  "old_values" jsonb NULL,
  "new_values" jsonb NULL,
  "performed_by" bigint NOT NULL,
  "performed_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "rbac_audit_log_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users" ("id")
);

-- Insert default resources
INSERT INTO "rbac_resources" ("name", "description") VALUES
('users', 'User management'),
('blogs', 'Blog posts management'),
('events', 'Events management'),
('news', 'Newsletter management'),
('career', 'Career management'),
('merch', 'Merchandise management'),
('orders', 'Orders management'),
('payments', 'Payments management'),
('registrars', 'Registrars management'),
('roles', 'Role management'),
('departments', 'Department management')
ON CONFLICT DO NOTHING;

-- Insert default actions
INSERT INTO "rbac_actions" ("name", "description") VALUES
('create', 'Create new records'),
('read:any', 'Read any record'),
('read:own', 'Read only own record'),
('update:any', 'Update any record'),
('update:own', 'Update only own record'),
('delete', 'Delete records'),
('publish', 'Publish/unpublish content')
ON CONFLICT DO NOTHING;

-- Insert default system roles
INSERT INTO "rbac_roles" ("name", "description", "is_system_role", "created_by") VALUES
('super_admin', 'Full system access', true, 1),
('admin', 'Administrative access to most resources', false, 1),
('content_manager', 'Manage content (blogs, events, news)', false, 1),
('hr_manager', 'Manage job postings and applications', false, 1),
('sales_manager', 'Manage products, orders and payments', false, 1),
('staff', 'Basic staff access', false, 1),
('guest', 'Minimal read-only access', true, 1);

-- Insert permissions (cartesian product of resources x actions)
INSERT INTO "rbac_permissions" ("resource_id", "action_id", "description")
SELECT r.id, a.id, r.name || ':' || a.name
FROM rbac_resources r
JOIN rbac_actions a ON a.name IN ('create', 'read:any', 'read:own', 'update:any', 'update:own', 'delete')
ON CONFLICT DO NOTHING;

-- Add 'publish' only for selected resources
INSERT INTO "rbac_permissions" ("resource_id", "action_id", "description")
SELECT r.id, a.id, r.name || ':' || a.name
FROM rbac_resources r
JOIN rbac_actions a ON a.name = 'publish'
WHERE r.name IN ('blogs', 'events', 'news', 'career')
ON CONFLICT DO NOTHING;

-- Assign role permissions
-- Super admin gets ALL
INSERT INTO rbac_role_permissions (role_id, permission_id, granted_by)
SELECT sr.id, p.id, 1
FROM rbac_roles sr, rbac_permissions p
WHERE sr.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Admin: all except publish
INSERT INTO rbac_role_permissions (role_id, permission_id, granted_by)
SELECT sr.id, p.id, 1
FROM rbac_roles sr
JOIN rbac_permissions p ON NOT EXISTS (
  SELECT 1 FROM rbac_actions a WHERE a.id = p.action_id AND a.name = 'publish'
)
WHERE sr.name = 'admin'
ON CONFLICT DO NOTHING;

-- Content manager: full on blogs, events, news, career
INSERT INTO rbac_role_permissions (role_id, permission_id, granted_by)
SELECT sr.id, p.id, 1
FROM rbac_roles sr
JOIN rbac_permissions p ON p.resource_id IN (
  SELECT id FROM rbac_resources WHERE name IN ('blogs','events','news','career')
)
WHERE sr.name = 'content_manager'
ON CONFLICT DO NOTHING;

-- HR Manager: career only
INSERT INTO rbac_role_permissions (role_id, permission_id, granted_by)
SELECT sr.id, p.id, 1
FROM rbac_roles sr
JOIN rbac_permissions p ON p.resource_id IN (
  SELECT id FROM rbac_resources WHERE name = 'career'
)
WHERE sr.name = 'hr_manager'
ON CONFLICT DO NOTHING;

-- Sales Manager: merch, orders, payments
INSERT INTO rbac_role_permissions (role_id, permission_id, granted_by)
SELECT sr.id, p.id, 1
FROM rbac_roles sr
JOIN rbac_permissions p ON p.resource_id IN (
  SELECT id FROM rbac_resources WHERE name IN ('merch','orders','payments')
)
WHERE sr.name = 'sales_manager'
ON CONFLICT DO NOTHING;

-- Staff: read:any on most resources
INSERT INTO rbac_role_permissions (role_id, permission_id, granted_by)
SELECT sr.id, p.id, 1
FROM rbac_roles sr
JOIN rbac_permissions p ON p.action_id = (SELECT id FROM rbac_actions WHERE name='read:any')
WHERE sr.name = 'staff'
ON CONFLICT DO NOTHING;

-- Guest: read:any on blogs, events, news, registrars
-- and read:own on users, orders, payments, career (job applications)
INSERT INTO rbac_role_permissions (role_id, permission_id, granted_by)
SELECT sr.id, p.id, 1
FROM rbac_roles sr
JOIN rbac_permissions p ON (
    -- Public readable
    (p.action_id = (SELECT id FROM rbac_actions WHERE name='read:any')
     AND p.resource_id IN (SELECT id FROM rbac_resources WHERE name IN ('blogs','events','news','registrars')))
    OR
    -- Restricted to own data
    (p.action_id = (SELECT id FROM rbac_actions WHERE name='read:own')
     AND p.resource_id IN (SELECT id FROM rbac_resources WHERE name IN ('users','orders','payments','career')))
)
WHERE sr.name = 'guest'
ON CONFLICT DO NOTHING;

-- Universal guarantee: all roles must have read:own + update:own on users
INSERT INTO rbac_role_permissions (role_id, permission_id, granted_by)
SELECT r.id, p.id, 1
FROM rbac_roles r
JOIN rbac_permissions p 
  ON p.resource_id = (SELECT id FROM rbac_resources WHERE name = 'users')
 AND p.action_id IN (
    SELECT id FROM rbac_actions WHERE name IN ('read:own','update:own')
 )
ON CONFLICT DO NOTHING;

-- 6. Assign bootstrap super_admin user role
INSERT INTO rbac_user_roles (user_id, role_id, assigned_by)
SELECT 1, sr.id, 1 FROM rbac_roles sr WHERE sr.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX idx_rbac_user_roles_user_id ON "rbac_user_roles" ("user_id");
CREATE INDEX idx_rbac_user_roles_role_id ON "rbac_user_roles" ("role_id");
CREATE INDEX idx_rbac_role_permissions_role_id ON "rbac_role_permissions" ("role_id");
CREATE INDEX idx_rbac_role_permissions_permission_id ON "rbac_role_permissions" ("permission_id");
CREATE INDEX idx_rbac_permissions_resource_action ON "rbac_permissions" ("resource_id", "action_id");
CREATE INDEX idx_rbac_audit_log_performed_by ON "rbac_audit_log" ("performed_by");
CREATE INDEX idx_rbac_audit_log_performed_at ON "rbac_audit_log" ("performed_at");
