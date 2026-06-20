import type { Metadata } from 'next';
import Link from 'next/link';
import { personalInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Ponte en contacto con ${personalInfo.name} para hablar sobre tu próximo proyecto.`,
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 mb-3">
            Contacto
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hablemos de tu próximo proyecto
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estoy disponible para colaborar en ideas, desarrollo web y oportunidades de trabajo.
          </p>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Información de contacto
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-lg font-medium text-blue-600 hover:text-blue-700"
                >
                  {personalInfo.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500">GitHub</p>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-blue-600 hover:text-blue-700"
                >
                  {personalInfo.github.replace('https://', '')}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-blue-600 hover:text-blue-700"
                >
                  {personalInfo.linkedin.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">¿Listo para iniciar?</h2>
            <p className="text-gray-300 mb-6">
              Envíame un mensaje y te responderé lo antes posible.
            </p>
            <div className="space-y-3">
              <Link
                href={`mailto:${personalInfo.email}`}
                className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white hover:bg-blue-700 transition"
              >
                Enviar email
              </Link>
              <Link
                href="/projects"
                className="inline-flex w-full justify-center rounded-lg border border-gray-700 px-5 py-3 text-center font-medium text-white hover:bg-gray-800 transition"
              >
                Ver proyectos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}