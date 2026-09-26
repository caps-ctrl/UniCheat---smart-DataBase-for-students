import type { Database, Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

type ChannelType = Database["public"]["Enums"]["channel_type"];

type MaterialRow = Pick<
  Tables<"materials">,
  "id" | "title" | "file_name" | "file_path" | "created_at" | "uploaded_by"
>;

export type MaterialFile = MaterialRow & {
  downloadUrl: string | null;
  previewUrl: string | null;
};

export type MaterialsResult = {
  materials: MaterialFile[];
  hasError: boolean;
};

const SIGNED_URL_LIFETIME_SECONDS = 60 * 60;

export async function getMaterials(
  subjectId: number,
  channelType: ChannelType,
): Promise<MaterialsResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select("id, title, file_name, file_path, created_at, uploaded_by")
    .eq("subject_id", subjectId)
    .eq("channel_type", channelType)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Nie udało się pobrać materiałów:", error);
    return { materials: [], hasError: true };
  }

  if (!data.length) {
    return { materials: [], hasError: false };
  }

  const bucket = process.env.SUPABASE_MATERIALS_BUCKET ?? "materials";
  const { data: signedFiles, error: signedUrlsError } = await supabase.storage
    .from(bucket)
    .createSignedUrls(
      data.map((material) => material.file_path),
      SIGNED_URL_LIFETIME_SECONDS,
    );
  console.log(signedFiles)

  if (signedUrlsError) {
    console.error("Nie udało się utworzyć linków do materiałów:", signedUrlsError);
  }

  const signedUrlByPath = new Map(
    signedFiles?.map((file) => [file.path, file.signedUrl] as const) ?? [],
  );


  const materials = data.map((material) => {
    const signedUrl = signedUrlByPath.get(material.file_path);

    if (!signedUrl) {
      return { ...material, downloadUrl: null, previewUrl: null };
    }

    const previewUrl = signedUrl;
    const downloadUrl = new URL(signedUrl);

    downloadUrl.searchParams.set("download", material.file_name);

    return {
      ...material,
      downloadUrl: downloadUrl.toString(),
      previewUrl,
    };
  });

  return { materials, hasError: false };
}
