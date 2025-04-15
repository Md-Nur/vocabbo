import Link from "next/link";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-300 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <Link href="/" className="link link-hover">
          About us
        </Link>
        <Link href="/" className="link link-hover">
          Contact
        </Link>
        <Link href="/" className="link link-hover">
          Terms
        </Link>
        <Link href="/" className="link link-hover">
          Privacy
        </Link>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a>
            <FaFacebook className="w-6 h-6" />
          </a>
          <a>
            <FaLinkedin className="w-6 h-6" />
          </a>
          <a>
            <FaTwitter className="w-6 h-6" />
          </a>
        </div>
      </nav>
      <aside>
        <p>
          Copyright &copy; {new Date().getFullYear()} - All right reserved by
          Vocabbo
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
