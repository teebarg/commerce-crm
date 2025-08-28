import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

export const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function uploadMediaToSupabase(file: File, folder = "images") {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { error } = await supabase.storage.from("media").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
    });
    if (error) throw error;
    const url = supabase.storage.from("media").getPublicUrl(fileName).data.publicUrl;
    return url;
}

export function getSupabasePathFromUrl(url: string): string | undefined {
    const match = /media\/([^?]+)/.exec(url);
    return match ? `media/${match[1]}` : undefined;
}

export async function removeMediaFromSupabase(url: string): Promise<boolean> {
    const path = getSupabasePathFromUrl(url);
    if (!path) return false;
    const { error } = await supabase.storage.from("media").remove([path]);
    if (error) return false;
    return true;
}
