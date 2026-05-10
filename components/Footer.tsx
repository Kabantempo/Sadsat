import { FaFacebookF, FaInstagram, FaTwitter, FaGooglePlusG, FaYoutube } from "react-icons/fa";

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaGooglePlusG, href: "#", label: "Google+" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

const navLinks = ["Home", "News", "About", "Contact Us", "Our Team"];

export default function Footer() {
  return (
    <footer>
      <div className="bg-[#1a1a1a] py-10 flex flex-col items-center gap-8">
        <div className="flex gap-5">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1a1a1a] transition-opacity hover:opacity-80"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-zinc-300 transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      <div className="bg-black py-4 text-center text-sm text-zinc-400">
        Copyright ©{new Date().getFullYear()}; Designed by{" "}
        <span className="font-semibold text-white">FAHEEM</span>
      </div>
    </footer>
  );
}
