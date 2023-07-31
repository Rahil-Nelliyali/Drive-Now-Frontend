import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const LINKS = [
  {
    title: "Be a Host",
    link: "/rentersignin",
  },
  {
    title: "About",
    link: "#",
  },
  {
    title: "Contact Us",
    link: "#",
  },
  {
    title: "Privacy Policy",
    link: "#",
  },
];

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto">
        <Typography variant="h5" className="mb-6">
          Drive Now
        </Typography>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {LINKS.map(({ title, link }) => (
            <Link key={title} to={link} className="block text-gray-300 hover:text-gray-100">
              {title}
            </Link>
          ))}
        </div>
        <Typography variant="small" className="block mt-8">
          &copy; {currentYear} Your Company. All Rights Reserved.
        </Typography>
        <div className="flex items-center justify-center mt-4">
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-100">
            <FaFacebook />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-100">
            <FaTwitter />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-100">
            <FaInstagram />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-100">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
