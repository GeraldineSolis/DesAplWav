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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Sobre Mí</h1>
      
      <div className="grid md:grid-cols-3 gap-8 items-start mb-12">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-md">
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ¡Hola! Soy {personalInfo.name}
          </h2>
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            Me especializo en el desarrollo de aplicaciones web utilizando las tecnologías modernas del ecosistema de JavaScript y React. Mi enfoque principal es crear soluciones optimizadas para motores de búsqueda (SEO) y con un excelente rendimiento.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Constantemente busco aprender nuevas herramientas y metodologías para escribir código limpio, mantenible y escalable. Disfruto resolver problemas complejos y transformar ideas en productos digitales funcionales.
          </p>
        </div>
      </div>

      <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Mis Competencias</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-1">Frontend</h4>
            <p className="text-sm text-gray-600">React, Next.js, HTML5, CSS3, Tailwind CSS</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-1">Backend</h4>
            <p className="text-sm text-gray-600">Node.js, Express, REST APIs, GraphQL</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-1">Bases de Datos</h4>
            <p className="text-sm text-gray-600">PostgreSQL, MongoDB, MySQL, Prisma</p>
          </div>
        </div>
      </section>
    </div>
  );
}