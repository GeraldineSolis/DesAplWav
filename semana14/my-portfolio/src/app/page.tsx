import Image from 'next/image';
import Link from 'next/link';
import { projects, personalInfo } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-20 rounded-[2rem] border border-[#eadbc7] bg-[#fffaf3]/90 p-8 shadow-sm md:p-12">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <Image
            src={personalInfo.avatar}
            alt={personalInfo.name}
            fill
            className="rounded-full object-cover"
            priority
            sizes="128px"
            quality={90}
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-[#3f3124] mb-4">
          {personalInfo.name}
        </h1>
        <p className="text-xl md:text-2xl text-[#a56f45] mb-6">
          {personalInfo.title}
        </p>
        <p className="text-lg text-[#5d4a3a] max-w-2xl mx-auto mb-8 leading-relaxed">
          {personalInfo.description}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/projects"
            className="bg-[#c98b5d] text-white px-6 py-3 rounded-xl hover:bg-[#b77d4b] transition shadow-sm"
          >
            Ver Proyectos
          </Link>
          <Link
            href="/about"
            className="bg-[#f3e6cf] text-[#5a4633] px-6 py-3 rounded-xl hover:bg-[#ead5a7] transition"
          >
            Sobre Mí
          </Link>
          <Link
            href="/contact"
            className="bg-[#5d7a63] text-white px-6 py-3 rounded-xl hover:bg-[#4f6c56] transition"
          >
            Contactar
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section>
        <h2 className="text-3xl font-bold text-[#3f3124] mb-8 text-center">
          Proyectos Destacados
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}