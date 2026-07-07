INSERT INTO public.user_roles (user_id, role)
SELECT '390c97a2-d536-4c88-b06e-3b8d50a8e85d'::uuid, 'admin'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = '390c97a2-d536-4c88-b06e-3b8d50a8e85d'::uuid AND role = 'admin'::app_role
);

INSERT INTO public.profiles (id, name, email)
SELECT '390c97a2-d536-4c88-b06e-3b8d50a8e85d'::uuid, 'Administrator', 'admin@civicconnect.app'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = '390c97a2-d536-4c88-b06e-3b8d50a8e85d'::uuid
);