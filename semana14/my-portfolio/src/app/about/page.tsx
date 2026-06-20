import { Metadata } from 'next';
import Image from 'next/image';
import { personalInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description: 'Conoce más sobre mi trayectoria profesional, mis habilidades técnicas y mi enfoque de desarrollo.',
  openGraph: {
    title: 'Sobre Mí - Portafolio',
    description: 'Conoce más sobre mi trayectoria como desarrollador web.',
    images: ['/og-about.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-[#3f3124]">Sobre Mí</h1>

      <div className="mb-12 grid items-start gap-8 md:grid-cols-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#eadbc7] shadow-sm">
          <Image
            src={personalInfo.avatar}
            alt={personalInfo.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            quality={85}
            loading="lazy"
          />
        </div>

        <div className="md:col-span-2">
          <h2 className="mb-4 text-2xl font-semibold text-[#3f3124]">
            ¡Hola! Soy {personalInfo.name}
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-[#5d4a3a]">
            Me especializo en el desarrollo de aplicaciones web utilizando las tecnologías modernas del ecosistema de JavaScript y React. Mi enfoque principal es crear soluciones optimizadas para motores de búsqueda (SEO) y con un excelente rendimiento.
          </p>
          <p className="text-lg leading-relaxed text-[#5d4a3a]">
            Constantemente busco aprender nuevas herramientas y metodologías para escribir código limpio, mantenible y escalable. Disfruto resolver problemas complejos y transformar ideas en productos digitales funcionales.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-[#eadbc7] bg-[#fffaf3] p-8 shadow-sm">
        <h3 className="mb-6 text-2xl font-bold text-[#3f3124]">Mis Competencias</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#f7efe3] p-4">
            <h4 className="mb-1 font-semibold text-[#3f3124]">Frontend</h4>
            <p className="text-sm text-[#5d4a3a]">React, Next.js, HTML5, CSS3, Tailwind CSS</p>
          </div>
          <div className="rounded-2xl bg-[#f7efe3] p-4">
            <h4 className="mb-1 font-semibold text-[#3f3124]">Backend</h4>
            <p className="text-sm text-[#5d4a3a]">Node.js, Express, REST APIs, GraphQL</p>
          </div>
          <div className="rounded-2xl bg-[#f7efe3] p-4">
            <h4 className="mb-1 font-semibold text-[#3f3124]">Bases de Datos</h4>
            <p className="text-sm text-[#5d4a3a]">PostgreSQL, MongoDB, MySQL, Prisma</p>
          </div>
        </div>
      </section>
    </div>
  );
}