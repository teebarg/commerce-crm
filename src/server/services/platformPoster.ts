import { env } from "@/env";

// --- Twitter ---
export async function postToTwitter({ text, mediaUrl, bearerToken, ...settings }: {
    text: string;
    mediaUrl?: string;
    bearerToken?: string;
    [key: string]: any;
}) {
    const token = bearerToken || env.TWITTER_BEARER_TOKEN;
    if (!token) throw new Error("Twitter Bearer token not set");
    const body: any = { text };
    // Optionally add media, hashtags, etc. here
    // if (mediaUrl) { ... }
    const response = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Twitter post failed");
    return { success: true, message: "Twitter post published successfully", data };
}

// --- Facebook ---
export async function postToFacebook({
    text,
    mediaUrl,
    pageAccessToken,
    pageId,
    ...settings
}: {
    text: string;
    mediaUrl?: string;
    pageAccessToken: string;
    pageId: string;
    [key: string]: any;
}) {
    console.log("🚀 ~ mediaUrl:", mediaUrl);
    // You need a Facebook Page Access Token and Page ID
    const url = `https://graph.facebook.com/${pageId}/feed`;
    const body = new URLSearchParams({ message: text, access_token: pageAccessToken });
    const res = await fetch(url, { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.error?.message ?? "Facebook post failed"}`);
    return { success: true, message: "Facebook post published successfully" };
}

// --- Instagram ---
export async function postToInstagram({
    text,
    mediaUrl,
    igUserId,
    accessToken,
}: {
    text: string;
    mediaUrl: string;
    igUserId: string;
    accessToken: string;
}) {
    // Instagram Graph API: first create a media object, then publish it
    // 1. Create media object
    const createMediaUrl = `https://graph.facebook.com/v19.0/${igUserId}/media`;
    const createRes = await fetch(
        createMediaUrl + `?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(text)}&access_token=${accessToken}`,
        { method: "POST" }
    );
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(`${createData.error?.message ?? "Instagram media creation failed"}`);
    // 2. Publish media object
    const publishUrl = `https://graph.facebook.com/v19.0/${igUserId}/media_publish`;
    const publishRes = await fetch(publishUrl + `?creation_id=${createData.id}&access_token=${accessToken}`, { method: "POST" });
    const publishData = await publishRes.json();
    if (!publishRes.ok) throw new Error(`${publishData.error?.message ?? "Instagram publish failed"}`);
    return { success: true, message: "Instagram post published successfully" };
}

// --- TikTok ---
export async function postToTikTok({ text, mediaUrl, accessToken }: { text: string; mediaUrl: string; accessToken: string }) {
    console.log("🚀 ~ postToTikTok ~ mediaUrl:", mediaUrl)
    console.log("🚀 ~ postToTikTok ~ text:", text)
    // TikTok API: https://developers.tiktok.com/doc/login-kit-manage-videos/
    // This is a placeholder; actual implementation requires OAuth and video upload
    // For now, throw if no credentials
    if (!accessToken) throw new Error("TikTok access token not set");
    // ... implement TikTok upload logic here ...
    return { success: true, message: "TikTok posting not fully implemented in this demo." };
}

// --- Main orchestrator ---
export async function postToPlatforms({
    text,
    mediaUrl,
    platforms,
    credentials,
    settings,
}: {
    text: string;
    mediaUrl?: string;
    platforms: string[];
    credentials: {
        twitter?: {};
        facebook?: { pageAccessToken: string; pageId: string };
        instagram?: { igUserId: string; accessToken: string };
        tiktok?: { accessToken: string };
    };
    settings?: {
        instagram?: string;
        twitter?: string;
        facebook?: string;
        tiktok?: string;
        timezone?: string;
        defaultPostTime?: string;
        notifications?: any;
    };
}) {
    const results: Record<string, any> = {};
    for (const platform of platforms) {
        try {
            if (platform === "twitter") {
                results.twitter = await postToTwitter({ text, mediaUrl, ...settings });
            } else if (platform === "facebook") {
                if (!credentials.facebook) throw new Error("Facebook credentials missing");
                results.facebook = await postToFacebook({ text, mediaUrl, ...credentials.facebook, ...settings });
            } else if (platform === "instagram") {
                if (!credentials.instagram) throw new Error("Instagram credentials missing");
                results.instagram = await postToInstagram({ text, mediaUrl: mediaUrl!, ...credentials.instagram, ...settings });
            } else if (platform === "tiktok") {
                if (!credentials.tiktok) throw new Error("TikTok credentials missing");
                results.tiktok = await postToTikTok({ text, mediaUrl: mediaUrl!, ...credentials.tiktok, ...settings });
            }
        } catch (err: any) {
            results[platform] = { error: err.message };
        }
    }
    return results;
}
