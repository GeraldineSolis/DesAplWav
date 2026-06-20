import { MetadataRoute } from 'next';
import { projects, personalInfo } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = personalInfo.siteUrl;

  // Páginas estáticas principales
  const routes = ['', '/projects', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '/contact'
      ? ('yearly' as const)
      : ('monthly' as const),
    priority: route === '' ? 1.0 : route === '/contact' ? 0.7 : 0.8,
  }));

  // Páginas dinámicas de cada proyecto
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...projectRoutes];
}