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
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a>
            <FaFacebook />
          </a>
          <a>
            <FaLinkedin />
          </a>
          <a>
            <FaTwitter />
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
