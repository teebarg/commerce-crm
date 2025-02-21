export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: process.env.NEXT_PUBLIC_NAME ?? "Merch.eco",
    description: "",
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    links: {
        github: "https://github.com/merch.eco",
        twitter: "https://twitter.com",
    },
};
