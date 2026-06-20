import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          loading="lazy"
        />
      </div>
      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
        <p className="text-gray-600 line-clamp-3 mb-4 grow">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="text-blue-600 font-semibold hover:text-blue-800 transition text-sm mt-auto inline-block"
        >
          Ver detalles &rarr;
        </Link>
      </div>
    </div>
  );
}