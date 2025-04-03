import { getRelativeLocaleUrl } from "astro:i18n";
import { getBaseUrl, useTranslations } from "src/i18n/utils";

export const getLinks = (currentLocale: string, currentPath: string) => {
  const parsedCurrentLocale = currentLocale === "en" ? "en" : currentLocale === "es" ? "es" : "ca";
  const t = useTranslations(parsedCurrentLocale);

  const baseUrl = getBaseUrl(parsedCurrentLocale);
  if (currentPath.startsWith(baseUrl)) {
    currentPath = currentPath.replace(baseUrl, "");
  }

  if (!currentPath.startsWith("/")) {
    currentPath = "/" + currentPath;
  }

  return [
    {
      key: "home",
      title: t("nav.home"),
      href: getRelativeLocaleUrl(parsedCurrentLocale, "/"),
      isActive: currentPath === "/",
    },
    {
      key: "projects",
      title: t("nav.projects"),
      href: getRelativeLocaleUrl(parsedCurrentLocale, "/projects"),
      isActive: currentPath.startsWith("/project"),
    },
    {
      key: "contact",
      title: t("nav.contact"),
      href: getRelativeLocaleUrl(parsedCurrentLocale, "/contact"),
      isActive: currentPath.startsWith("/contact"),
    },
  ];
}

export const getSocialLinks = () => {
  return [
    { title: "Instagram", href: "https://www.instagram.com/somos.experiences/" },
    { title: "Vimeo", href: "https://vimeo.com/somosexperiences" },
    {
      title: "Linkedin",
      href: "https://www.linkedin.com/company/somos-experiences/",
    },
  ];
}