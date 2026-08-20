import type { SelectDropdownOption } from '@bookio/ui';

export const META_PROPERTIES: SelectDropdownOption[] = [
    // --- Standard HTML meta (name=) ---
    { label: 'Keywords', value: 'keywords' },
    { label: 'Author', value: 'author' },
    { label: 'Robots', value: 'robots' },
    { label: 'Viewport', value: 'viewport' },
    { label: 'Theme color', value: 'theme-color' },
    { label: 'Color scheme', value: 'color-scheme' },
    { label: 'Referrer policy', value: 'referrer' },
    { label: 'Format detection', value: 'format-detection' },
    { label: 'Application name', value: 'application-name' },
    { label: 'Generator', value: 'generator' },
    { label: 'Copyright', value: 'copyright' },
    { label: 'Language', value: 'language' },
    { label: 'Revisit after', value: 'revisit-after' },
    { label: 'Rating', value: 'rating' },
    { label: 'Distribution', value: 'distribution' },
    { label: 'Google site verification', value: 'google-site-verification' },
    { label: 'MS validate', value: 'msvalidate.01' },
    { label: 'Yandex verification', value: 'yandex-verification' },
    { label: 'Pinterest verification', value: 'p:domain_verify' },

    // --- Apple / PWA ---
    { label: 'Apple mobile web app capable', value: 'apple-mobile-web-app-capable' },
    { label: 'Apple mobile web app title', value: 'apple-mobile-web-app-title' },
    {
        label: 'Apple mobile web app status bar style',
        value: 'apple-mobile-web-app-status-bar-style',
    },
    { label: 'Mobile web app capable', value: 'mobile-web-app-capable' },
    { label: 'MS application tile color', value: 'msapplication-TileColor' },
    { label: 'MS application config', value: 'msapplication-config' },

    // --- Open Graph (property=) ---
    { label: 'OG type', value: 'og:type' },
    { label: 'OG title', value: 'og:title' },
    { label: 'OG description', value: 'og:description' },
    { label: 'OG url', value: 'og:url' },
    { label: 'OG site name', value: 'og:site_name' },
    { label: 'OG image', value: 'og:image' },
    { label: 'OG image secure URL', value: 'og:image:secure_url' },
    { label: 'OG image type', value: 'og:image:type' },
    { label: 'OG image width', value: 'og:image:width' },
    { label: 'OG image height', value: 'og:image:height' },
    { label: 'OG image alt', value: 'og:image:alt' },
    { label: 'OG locale', value: 'og:locale' },
    { label: 'OG locale alternate', value: 'og:locale:alternate' },
    { label: 'OG determiner', value: 'og:determiner' },
    { label: 'OG audio', value: 'og:audio' },
    { label: 'OG video', value: 'og:video' },
    { label: 'OG video width', value: 'og:video:width' },
    { label: 'OG video height', value: 'og:video:height' },
    { label: 'OG video type', value: 'og:video:type' },

    // --- Open Graph article ---
    { label: 'Article published time', value: 'article:published_time' },
    { label: 'Article modified time', value: 'article:modified_time' },
    { label: 'Article expiration time', value: 'article:expiration_time' },
    { label: 'Article author', value: 'article:author' },
    { label: 'Article section', value: 'article:section' },
    { label: 'Article tag', value: 'article:tag' },

    // --- Open Graph profile ---
    { label: 'Profile first name', value: 'profile:first_name' },
    { label: 'Profile last name', value: 'profile:last_name' },
    { label: 'Profile username', value: 'profile:username' },
    { label: 'Profile gender', value: 'profile:gender' },

    // --- Facebook ---
    { label: 'Facebook app ID', value: 'fb:app_id' },
    { label: 'Facebook pages', value: 'fb:pages' },

    // --- Twitter Card (name=) ---
    { label: 'Twitter card type', value: 'twitter:card' },
    { label: 'Twitter site', value: 'twitter:site' },
    { label: 'Twitter site ID', value: 'twitter:site:id' },
    { label: 'Twitter creator', value: 'twitter:creator' },
    { label: 'Twitter creator ID', value: 'twitter:creator:id' },
    { label: 'Twitter title', value: 'twitter:title' },
    { label: 'Twitter description', value: 'twitter:description' },
    { label: 'Twitter image', value: 'twitter:image' },
    { label: 'Twitter image alt', value: 'twitter:image:alt' },
    { label: 'Twitter player', value: 'twitter:player' },
    { label: 'Twitter player width', value: 'twitter:player:width' },
    { label: 'Twitter player height', value: 'twitter:player:height' },
    { label: 'Twitter app name iPhone', value: 'twitter:app:name:iphone' },
    { label: 'Twitter app ID iPhone', value: 'twitter:app:id:iphone' },
    { label: 'Twitter app URL iPhone', value: 'twitter:app:url:iphone' },
    { label: 'Twitter app name iPad', value: 'twitter:app:name:ipad' },
    { label: 'Twitter app ID iPad', value: 'twitter:app:id:ipad' },
    { label: 'Twitter app URL iPad', value: 'twitter:app:url:ipad' },
    { label: 'Twitter app name Google Play', value: 'twitter:app:name:googleplay' },
    { label: 'Twitter app ID Google Play', value: 'twitter:app:id:googleplay' },
    { label: 'Twitter app URL Google Play', value: 'twitter:app:url:googleplay' },

    // --- Dublin Core (optional SEO) ---
    { label: 'DC title', value: 'DC.title' },
    { label: 'DC creator', value: 'DC.creator' },
    { label: 'DC subject', value: 'DC.subject' },
    { label: 'DC description', value: 'DC.description' },
    { label: 'DC publisher', value: 'DC.publisher' },
    { label: 'DC date', value: 'DC.date' },
    { label: 'DC type', value: 'DC.type' },
    { label: 'DC format', value: 'DC.format' },
    { label: 'DC identifier', value: 'DC.identifier' },
    { label: 'DC language', value: 'DC.language' },
    { label: 'DC rights', value: 'DC.rights' },
];

export type MetaPropertyValue = (typeof META_PROPERTIES)[number]['value'];
