-- Keep report changes, soft deletion and the audit record in one transaction.
DO $migration$
DECLARE
  target_table text;
  moderator_check text := '(exists (select 1 from public.profiles where id = (select auth.uid()) and role in (''admin'', ''moderator'')))';
BEGIN
  FOREACH target_table IN ARRAY ARRAY['material_reports', 'reported_lecturer_comments', 'materials', 'lecturer_comments']
  LOOP
    EXECUTE format(
      'create policy "Moderators can update reported content" on public.%I for update to authenticated using (%s) with check (%s)',
      target_table, moderator_check, moderator_check
    );
  END LOOP;

  ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
  -- Existing permissive policies must not allow a forged moderator_id.
  CREATE POLICY "Action moderator must match session"
    ON public.moderation_actions AS RESTRICTIVE
    FOR INSERT TO authenticated
    WITH CHECK (moderator_id = (select auth.uid()));

  CREATE FUNCTION public.moderate_report(
    p_report_table text,
    p_report_id bigint,
    p_status public."reportStatus_type",
    p_reason text DEFAULT NULL
  ) RETURNS void
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
  AS $function$
  DECLARE
    actor_id uuid := auth.uid();
    old_status public."reportStatus_type";
    content_id bigint;
    content_table text;
    content_key text;
    affected_rows integer;
  BEGIN
    IF actor_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = actor_id AND role IN ('admin', 'moderator')
    ) THEN
      RAISE EXCEPTION 'Moderator access required' USING ERRCODE = '42501';
    END IF;

    IF p_report_table IS NULL OR p_report_table NOT IN ('material_reports', 'reported_lecturer_comments')
      OR p_report_id IS NULL OR p_report_id <= 0 OR p_report_id > 9007199254740991
      OR p_status IS NULL
      OR (p_reason IS NOT NULL AND (length(btrim(p_reason)) = 0 OR length(p_reason) > 1000)) THEN
      RAISE EXCEPTION 'Invalid moderation input' USING ERRCODE = '22023';
    END IF;

    IF p_report_table = 'material_reports' THEN
      content_table := 'materials';
      content_key := 'material_id';
    ELSE
      content_table := 'lecturer_comments';
      content_key := 'coment_id';
    END IF;

    -- Serialize decisions so repeated requests cannot log the same decision twice.
    EXECUTE format('select status, %I from public.%I where id = $1 for update', content_key, p_report_table)
      INTO old_status, content_id USING p_report_id;
    IF old_status IS NULL THEN
      RAISE EXCEPTION 'Report not found' USING ERRCODE = 'P0002';
    END IF;
    IF old_status = p_status OR (old_status <> 'pending' AND p_status <> 'pending') THEN
      RAISE EXCEPTION 'Report status has already changed' USING ERRCODE = '22023';
    END IF;

    IF p_status = 'resolved' THEN
      -- Preserve the deletion date if another report concerns the same content.
      EXECUTE format('update public.%I set deleted_at = coalesce(deleted_at, now()) where id = $1', content_table)
        USING content_id;
      GET DIAGNOSTICS affected_rows = ROW_COUNT;
      IF affected_rows <> 1 THEN
        RAISE EXCEPTION 'Reported content not found or not writable' USING ERRCODE = 'P0002';
      END IF;
    END IF;

    EXECUTE format('update public.%I set status = $1 where id = $2', p_report_table)
      USING p_status, p_report_id;
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    IF affected_rows <> 1 THEN
      RAISE EXCEPTION 'Report not writable' USING ERRCODE = '42501';
    END IF;

    INSERT INTO public.moderation_actions (moderator_id, report_id, report_type, action, reason)
      VALUES (actor_id, p_report_id, p_report_table, p_status::text, btrim(p_reason));
    -- Reopening a report does not automatically restore removed content.
  END;
  $function$;

  REVOKE ALL ON FUNCTION public.moderate_report(text, bigint, public."reportStatus_type", text) FROM PUBLIC, anon;
  GRANT EXECUTE ON FUNCTION public.moderate_report(text, bigint, public."reportStatus_type", text) TO authenticated;
END;
$migration$;
