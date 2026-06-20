import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#eadbc7] bg-[#fffaf3] shadow-sm transition duration-200 hover:-translate-y-0.5">
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
      <div className="flex grow flex-col p-6">
        <h3 className="mb-2 text-xl font-bold text-[#3f3124]">{project.title}</h3>
        <p className="mb-4 grow text-[#5d4a3a] line-clamp-3">{project.description}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-full bg-[#f3e6cf] px-2.5 py-1 text-xs text-[#5a4633]">
              {tech}
            </span>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-auto inline-block text-sm font-semibold text-[#c98b5d] transition hover:text-[#a56f45]"
        >
          Ver detalles &rarr;
        </Link>
      </div>
    </div>
  );
}