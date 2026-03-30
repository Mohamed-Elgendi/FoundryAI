import { Twitter, Linkedin, Github } from 'lucide-react';

const footerSections = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Demo', 'Changelog'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'Guides', 'Templates', 'API Docs'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Press', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security'],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl text-white">FoundryAI</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Forge Your Business Success with AI-Powered Planning
            </p>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-violet-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            © 2026 FoundryAI. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-slate-400 hover:text-violet-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-violet-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-violet-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
