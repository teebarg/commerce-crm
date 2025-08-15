export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: process.env.NEXT_PUBLIC_APP_NAME ?? "TeeBarg",
    description: "",
    contactEmail: process.env.CONTACT_EMAIL,
    contactPhone: process.env.CONTACT_PHONE,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    links: {
        github: "https://github.com/teebarg",
        twitter: "https://twitter.com",
    },
};
