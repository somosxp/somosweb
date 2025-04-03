export interface CriteriaBuilder {
  pageNumber: number;
  pageSize: number;
  orderBy: string;
  order: string;
  filters?: Filter[];
}

export interface ArticleData {
  title: string;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  link: string;
  tags: string[];
  data: ArticleData[];
}

export interface Category {
  id: number;
  title: string;
  key: string;
}

export interface Award {
  id: number;
  title: string;
  image: string;
  years: string[];
  description: string;
}

export interface Company {
  id: number;
  name: string;
  city: string;
  telephone: string;
  address: string;
  zipCode: string;
}

export interface Filter {
  key: string;
  value: string | number;
}

export interface EmailAddress {
  email: string;
  name: string;
}

export interface MailMessage {
  to: EmailAddress[];
  from?: EmailAddress;
  subject: string;
  message: string;
}