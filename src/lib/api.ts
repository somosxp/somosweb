import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from "@getbrevo/brevo";
import { apiFetch } from "./fetchClient";
import type { Project, Category, CriteriaBuilder, Award, Company, Filter, MailMessage } from "./types";

const BASE_URL = import.meta.env.SITE || 'http://localhost:4321';
const BASE_IMAGE_URL = import.meta.env.BASE_IMAGE_URL;
const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const BREVO_SENDER = import.meta.env.BREVO_SENDER ?? 'digital@somosexperiences.com';
const NEWSLETTER_EMAIL = import.meta.env.NEWSLETTER_EMAIL ?? 'digital@somosexperiences.com';
const PROJECTS_CATEGORY_ID = 1;
const TTL = 1200;
const projectsCache = new Map();
const categoriesCache = new Map();

export const mapProject = (item: any): Project => ({
  id: item.id,
  title: item.description?.title || "Untitled",
  description: item.description?.fulldescription || "",
  shortDescription: item.description?.short_description || "",
  image: item.image_url || `${BASE_IMAGE_URL}${item.image || "default.png"}`,
  link: item.metas?.description?.slug || "#",
  tags: ["Branding", "Interaction Design", "Website"],
  data: [
    {
      title: "10M",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    },
    {
      title: "120+",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    },
    {
      title: "8M",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    },
    {
      title: "535$",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    },
    {
      title: "436+",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    }
  ]
});

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  try {
    const { items } = await apiFetch(`/articles/all?filter_metas_description|slug=${slug}&limit=1&with=metas`);
    const item = items[0];
    return mapProject(item);
  } catch (error) {
    console.error(`Error fetching project: ${slug}`, error);
    return null;
  }
}

export const getProject = async (id: number): Promise<Project | null> => {
  try {
    const { items } = await apiFetch(`/articles/all?filter_id=${id}&limit=1`);
    const item = items[0];
    return mapProject(item);
  } catch (error) {
    console.error(`Error fetching project: ${id}`, error);
    return null;
  }
};

const getCachedDataIfAvailableOrNull = (cache: Map<string, any>, key: string, ttl: number = 1200) => {
  if (!cache.has(key)) {
    return null;
  }

  let now = Date.now();
  const { timestamp, data } = cache.get(key);
  if (now - timestamp > ttl * 1000) {
    cache.delete(key);
    return null;
  }

  return data;
}

export const getProjects = async (criteria: CriteriaBuilder): Promise<Project[]> => {
  try {
    let url = '/articles/all'
    const params = []
    params.push(`category_id=${PROJECTS_CATEGORY_ID}`)
    params.push(`limit=${criteria.pageSize}`)
    params.push(`page=${criteria.pageNumber}`)
    params.push(`sort=${criteria.orderBy}`)
    params.push(`order=${criteria.order}`)

    let hasFilterStatus = false
    if (criteria.filters) {
      criteria.filters.forEach((filter: Filter) => {
        if (filter.key === 'status') {
          hasFilterStatus = true
        }

        if (filter.key !== 'category') {
          params.push(`filter_${filter.key}=${filter.value.toString()}`)
        }
      })
    }

    if (!hasFilterStatus) {
      params.push(`filter_status=1`)
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    const key = btoa(url);
    const data = getCachedDataIfAvailableOrNull(projectsCache, key, TTL);
    if (data !== null) {
      return data;
    }

    const { items } = await apiFetch(url);
    const itemsMap = items.map(mapProject);
    projectsCache.set(key, { timestamp: Date.now(), data: itemsMap });
    return itemsMap;
  } catch (error) {
    console.error("Error fetching projects", error);
    return [];
  }
};

export const mapCategory = (item: any): Category => ({
  id: item.id,
  title: item.title || "Untitled",
  key: item.key,
});

export const getCategories = async (): Promise<Category[]> => {
  try {
    const url = `/article_category/all?filter_parent_id=${PROJECTS_CATEGORY_ID}`
    const key = btoa(url)
    const data = getCachedDataIfAvailableOrNull(categoriesCache, key, TTL);
    if (data !== null) {
      return data;
    }

    const { items } = await apiFetch(url);
    const categoriesMap = items.map(mapCategory)
    categoriesCache.set(key, { timestamp: Date.now(), data: categoriesMap });
    return categoriesMap;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

export const getAwards = async (): Promise<Award[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/awards`, { method: 'GET' })
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching awards", error);
    return [];
  }
}

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/companies`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching companies", error);
    return [];
  }
}


export const sendEmail = (content: MailMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!BREVO_API_KEY) {
      return reject(new Response(JSON.stringify({ error: 'BREVO_API_KEY not configured' }), { status: 500 }));
    }

    let apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);
    let sendSmtpEmail = new SendSmtpEmail();

    if (!content.from) {
      content.from = { name: "SOMOS Experiences", email: BREVO_SENDER };
    }

    sendSmtpEmail.subject = content.subject;
    sendSmtpEmail.htmlContent = content.message;
    sendSmtpEmail.sender = { "name": content.from.name, "email": content.from.email };
    sendSmtpEmail.to = content.to.map((to) => ({ "email": to.email, "name": to.name }));

    apiInstance.sendTransacEmail(sendSmtpEmail)
      .then(function (data) {
        resolve(data);
      }, function (error) {
        reject(error);
      });
  })
}