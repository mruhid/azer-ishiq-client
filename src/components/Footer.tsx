import { Github, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <div className="relative bottom-0 mt-2">
      <footer className="w-full bg-gray-900 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start justify-start gap-y-3">
            <h2 className="mb-2 text-lg font-semibold">Developed by</h2>
            <div className="flex flex-col items-start justify-start gap-y-4">
              <div>
                <p className="text-sm text-gray-300">
                  <strong>Ruhid Mammadzade</strong> – Front-end Developer
                </p>
                <div className="mt-2 flex gap-4 text-xl">
                  <a
                    href="https://github.com/mruhid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Github />
                  </a>
                  <a
                    href="https://linkedin.com/in/your-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Linkedin />
                  </a>
                  <a
                    href="https://linkedin.com/in/teammate-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Mail />
                  </a>
                  <a
                    href="https://linkedin.com/in/teammate-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Phone />
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  <strong>Faryaz Hajimuradov</strong> – Back-end Developer
                  (.NET)
                </p>
                <div className="mt-2 flex gap-4 text-xl">
                  <a
                    href="https://github.com/teammate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Github />
                  </a>
                  <a
                    href="https://linkedin.com/in/teammate-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Linkedin />
                  </a>
                  <a
                    href="https://linkedin.com/in/teammate-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Mail />
                  </a>
                  <a
                    href="https://linkedin.com/in/teammate-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Phone />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="max-w-md">
            <h2 className="mb-2 text-lg font-semibold">About This Project</h2>
            <p className="text-sm text-gray-400">
              This project was built collaboratively during our internship to
              showcase full-stack development and teamwork between front-end and
              back-end technologies.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Intern Project by Ruhid & Team. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
