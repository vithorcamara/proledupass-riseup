// src/components/Footer.jsx
import { FaWhatsapp, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const socialLinks = [
    { href: "https://www.instagram.com/proleduca/", icon: <FaInstagram size={24} />, label: "Instagram" },
    { href: "https://www.facebook.com/proleduca/?locale=pt_BR", icon: <FaFacebook size={24} />, label: "Facebook" },
    { href: "https://br.linkedin.com/company/prol-educa", icon: <FaLinkedin size={24} />, label: "LinkedIn" },
  ];

  const footerSections = [
    {
      title: "ACESSE O SISTEMA",
      content: <Link to="/login" className="hover:text-blue-600 underline">Faça aqui o seu login</Link>,
    },
    {
      title: "PROL EDUCA",
      content: "Endereço: R. do Bom Jesus, 237 - Recife, PE, 50030-170",
    },
    {
      title: "NAVEGAÇÃO",
      links: [
        // { to: "/institucional", text: "Institucional" },
        { to: "/#opportunities", text: "Explore Oportunidades" },
        { to: "/suport", text: "Suporte" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-100 text-slate-700 border-t border-slate-200"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-30 text-sm">
          {footerSections.map(section => (
            <div key={section.title} className="text-center sm:text-left">
              <h4 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">
                {section.title}
              </h4>
              {section.content && <p className="leading-relaxed text-slate-600">{section.content}</p>}
              {section.links && (
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.text}>
                      <Link to={link.to} className="text-slate-600 hover:text-blue-600 hover:underline transition-colors duration-300">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="flex flex-col items-center sm:items-start space-y-3 text-center sm:text-left">
            <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-xs">
              Redes sociais
            </h4>
            <div className="flex space-x-5">
              {socialLinks.map(social => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-slate-500 hover:text-blue-600 transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-200 text-center py-5"> 
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Prol Educa (Edupass). Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
