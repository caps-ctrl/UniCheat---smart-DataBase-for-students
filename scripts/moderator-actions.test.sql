-- Run against the seeded local database:
-- npx supabase db query --local --file scripts/moderator-actions.test.sql
-- All changes are rolled back, including fixtures and the failing audit trigger.
DO $test$
DECLARE
  moderator uuid;
  regular_user uuid;
  material_report bigint;
  comment_report bigint;
  material bigint;
  comment bigint;
  audit_count bigint;
  deletion_date timestamptz;
BEGIN
  BEGIN
    SELECT id INTO STRICT moderator FROM public.profiles WHERE role = 'admin' LIMIT 1;
    SELECT id INTO STRICT regular_user FROM public.profiles WHERE role = 'user' LIMIT 1;
    SELECT id, material_id INTO STRICT material_report, material FROM public.material_reports LIMIT 1;
    SELECT id, coment_id INTO STRICT comment_report, comment FROM public.reported_lecturer_comments LIMIT 1;
    UPDATE public.material_reports SET status = 'pending' WHERE id = material_report;
    UPDATE public.reported_lecturer_comments SET status = 'pending' WHERE id = comment_report;
    UPDATE public.materials SET deleted_at = NULL WHERE id = material;
    UPDATE public.lecturer_comments SET deleted_at = NULL WHERE id = comment;
    UPDATE public.profiles SET role = 'moderator' WHERE id = moderator;
    SELECT count(*) INTO audit_count FROM public.moderation_actions;

    PERFORM set_config('request.jwt.claim.sub', moderator::text, true);
    SET LOCAL ROLE authenticated;
    PERFORM public.moderate_report('material_reports', material_report, 'resolved', 'test material');
    PERFORM public.moderate_report('reported_lecturer_comments', comment_report, 'resolved', 'test comment');
    BEGIN
      PERFORM public.moderate_report('material_reports', material_report, 'resolved');
      RAISE EXCEPTION 'Duplicate decision was accepted' USING ERRCODE = 'ZT002';
    EXCEPTION WHEN invalid_parameter_value THEN NULL;
    END;
    BEGIN
      INSERT INTO public.moderation_actions (moderator_id, action) VALUES (regular_user, 'forged');
      RAISE EXCEPTION 'Forged moderator_id was accepted' USING ERRCODE = 'ZT002';
    EXCEPTION WHEN insufficient_privilege THEN NULL;
    END;
    BEGIN
      PERFORM public.moderate_report('profiles', material_report, 'resolved');
      RAISE EXCEPTION 'Invalid table was accepted' USING ERRCODE = 'ZT002';
    EXCEPTION WHEN invalid_parameter_value THEN NULL;
    END;
    BEGIN
      PERFORM public.moderate_report('material_reports', 9007199254740991, 'resolved');
      RAISE EXCEPTION 'Missing report was accepted' USING ERRCODE = 'ZT002';
    EXCEPTION WHEN no_data_found THEN NULL;
    END;
    RESET ROLE;

    IF (SELECT status FROM public.material_reports WHERE id = material_report) <> 'resolved'
      OR (SELECT status FROM public.reported_lecturer_comments WHERE id = comment_report) <> 'resolved'
      OR (SELECT deleted_at FROM public.materials WHERE id = material) IS NULL
      OR (SELECT deleted_at FROM public.lecturer_comments WHERE id = comment) IS NULL
      OR (SELECT count(*) FROM public.moderation_actions) <> audit_count + 2
      OR NOT EXISTS (SELECT 1 FROM public.moderation_actions WHERE moderator_id = moderator
        AND report_id = material_report AND report_type = 'material_reports' AND action = 'resolved' AND reason = 'test material')
      OR NOT EXISTS (SELECT 1 FROM public.moderation_actions WHERE moderator_id = moderator
        AND report_id = comment_report AND report_type = 'reported_lecturer_comments' AND action = 'resolved' AND reason = 'test comment') THEN
      RAISE EXCEPTION 'Acceptance or audit failed';
    END IF;

    SELECT deleted_at INTO deletion_date FROM public.materials WHERE id = material;
    UPDATE public.profiles SET role = 'admin' WHERE id = moderator;
    SET LOCAL ROLE authenticated;
    PERFORM public.moderate_report('material_reports', material_report, 'pending');
    PERFORM public.moderate_report('material_reports', material_report, 'rejected');
    RESET ROLE;
    IF (SELECT deleted_at FROM public.materials WHERE id = material) IS DISTINCT FROM deletion_date
      OR (SELECT count(*) FROM public.moderation_actions) <> audit_count + 4 THEN
      RAISE EXCEPTION 'Reopening/rejection changed content or missed audit';
    END IF;

    PERFORM set_config('request.jwt.claim.sub', regular_user::text, true);
    SET LOCAL ROLE authenticated;
    BEGIN
      PERFORM public.moderate_report('material_reports', material_report, 'pending');
      RAISE EXCEPTION 'Regular user was authorized' USING ERRCODE = 'ZT002';
    EXCEPTION WHEN insufficient_privilege THEN NULL;
    END;
    RESET ROLE;
    PERFORM set_config('request.jwt.claim.sub', '', true);
    BEGIN
      PERFORM public.moderate_report('material_reports', material_report, 'pending');
      RAISE EXCEPTION 'Missing session was authorized' USING ERRCODE = 'ZT002';
    EXCEPTION WHEN insufficient_privilege THEN NULL;
    END;

    -- Force an audit failure and verify both earlier updates roll back.
    UPDATE public.material_reports SET status = 'pending' WHERE id = material_report;
    UPDATE public.materials SET deleted_at = NULL WHERE id = material;
    CREATE FUNCTION pg_temp.fail_moderation_audit() RETURNS trigger LANGUAGE plpgsql AS $trigger$
    BEGIN
      RAISE EXCEPTION 'Simulated audit failure' USING ERRCODE = '23514';
    END;
    $trigger$;
    CREATE TRIGGER test_fail_moderation_audit BEFORE INSERT ON public.moderation_actions
      FOR EACH ROW EXECUTE FUNCTION pg_temp.fail_moderation_audit();
    PERFORM set_config('request.jwt.claim.sub', moderator::text, true);
    SET LOCAL ROLE authenticated;
    BEGIN
      PERFORM public.moderate_report('material_reports', material_report, 'resolved');
      RAISE EXCEPTION 'Audit failure was ignored' USING ERRCODE = 'ZT002';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    RESET ROLE;
    IF (SELECT status FROM public.material_reports WHERE id = material_report) <> 'pending'
      OR (SELECT deleted_at FROM public.materials WHERE id = material) IS NOT NULL
      OR (SELECT count(*) FROM public.moderation_actions) <> audit_count + 4 THEN
      RAISE EXCEPTION 'Failed audit did not roll back the transaction';
    END IF;

    RAISE EXCEPTION 'Rollback successful tests' USING ERRCODE = 'ZT001';
  EXCEPTION WHEN SQLSTATE 'ZT001' THEN
    RAISE NOTICE 'PASS: acceptance for both types, audit identity, duplicate/missing report, invalid table, rejection, reopening, authorization, atomic rollback';
  END;
END;
$test$;
