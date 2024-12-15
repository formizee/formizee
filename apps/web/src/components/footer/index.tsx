import {ThemeToggle} from '../theme/toggle';
import {Button, Logo} from '@formizee/ui';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="flex justify-center items-center w-full mt-12 border-t dark:border-neutral-800">
      <div className="flex flex-col p-6 sm:p-12 sm:flex-row w-full sm:max-w-[1000px]">
        <div className="flex flex-row gap-12 mb-8 justify-between sm:gap-0 sm:flex-col min-w-56">
          <div className="flex flex-col">
            <Logo />
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              The Forms Backend Platform
            </p>
            <ThemeToggle className="mt-4 flex sm:hidden" />
          </div>
          <div className="my-6 flex flex-row gap-2">
            <Button asChild size="icon" variant="outline">
              <Link href="https://github.com/formizee" target="_blank">
                <svg viewBox="0 0 438.549 438.549" className="h-4 w-4">
                  <path
                    fill="currentColor"
                    d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                  />
                </svg>
              </Link>
            </Button>
            <Button asChild size="icon" variant="outline">
              <Link
                href="https://bsky.app/profile/formizee.com"
                target="_blank"
              >
                <svg role="img" viewBox="0 0 24 24 " className="h-4 w-4">
                  <path
                    fill="currentColor"
                    d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"
                  />
                </svg>
              </Link>
            </Button>
            <Button asChild size="icon" variant="outline">
              <Link href="https://x.com/formizeedev" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
            </Button>
          </div>
          <ThemeToggle className="hidden sm:flex" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(0,auto))] gap-10 sm:px-10 w-full selection-none">
          <nav>
            <span className="font-secondary font-semibold">Company</span>
            <ul className="flex flex-col mt-4 gap-4">
              <li>
                <Link
                  href="/about"
                  className="text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="https://status.formizee.com"
                  className="text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
                >
                  Status Page
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="https://github.com/formizee/formizee"
                  className="text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
                >
                  Source Code
                </Link>
              </li>
            </ul>
          </nav>
          <nav>
            <span className="font-secondary font-semibold">Resources</span>
            <ul className="flex flex-col mt-4 gap-4">
              <li>
                <Link
                  href="/blog"
                  className="text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="https://docs.formizee.com"
                  className="text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="/oss-friends"
                  className="text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
                >
                  OSS Friends
                </Link>
              </li>
            </ul>
          </nav>
          <nav>
            <span className="font-secondary font-semibold">Legal</span>
            <ul className="flex flex-col mt-4 gap-4">
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
                >
                  Terms Of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy-policy"
                  className="text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
