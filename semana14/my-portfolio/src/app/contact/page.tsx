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
      <section className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c98b5d]">
            Contacto
          </p>
          <h1 className="mb-4 text-4xl font-bold text-[#3f3124] md:text-5xl">
            Hablemos de tu próximo proyecto
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#5d4a3a]">
            Estoy disponible para colaborar en ideas, desarrollo web y oportunidades de trabajo.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[#eadbc7] bg-[#fffaf3] p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-[#3f3124]">
              Información de contacto
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-sm text-[#8b6b4f]">Email</p>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-lg font-medium text-[#c98b5d] hover:text-[#a56f45]"
                >
                  {personalInfo.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-[#8b6b4f]">GitHub</p>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-[#c98b5d] hover:text-[#a56f45]"
                >
                  {personalInfo.github.replace('https://', '')}
                </a>
              </div>
              <div>
                <p className="text-sm text-[#8b6b4f]">LinkedIn</p>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-[#c98b5d] hover:text-[#a56f45]"
                >
                  {personalInfo.linkedin.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#3f3124] p-8 text-[#f7efe3]">
            <h2 className="mb-4 text-2xl font-semibold">¿Listo para iniciar?</h2>
            <p className="mb-6 text-[#e4d2b3]">
              Envíame un mensaje y te responderé lo antes posible.
            </p>
            <div className="space-y-3">
              <Link
                href={`mailto:${personalInfo.email}`}
                className="inline-flex w-full justify-center rounded-xl bg-[#c98b5d] px-5 py-3 text-center font-medium text-white transition hover:bg-[#b77d4b]"
              >
                Enviar email
              </Link>
              <Link
                href="/projects"
                className="inline-flex w-full justify-center rounded-xl border border-[#5d4a3a] px-5 py-3 text-center font-medium text-[#f7efe3] transition hover:bg-[#4c3a2f]"
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