import Link from 'next/link';
import { personalInfo } from '@/lib/data';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eadbc7] bg-[#fffaf3]/90 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#3f3124] font-display">
            {personalInfo.name}
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="text-[#5d4a3a] hover:text-[#c98b5d] transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-[#5d4a3a] hover:text-[#c98b5d] transition">
                Proyectos
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-[#5d4a3a] hover:text-[#c98b5d] transition">
                Sobre Mí
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[#5d4a3a] hover:text-[#c98b5d] transition">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}