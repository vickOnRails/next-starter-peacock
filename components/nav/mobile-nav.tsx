'use client'

import { cn } from '@utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useMenuContext } from '../MenuContext';

// TODO: have some kind of functionality for closing the mobile menu when navigation occurs
// this was possible in previous versions with router.events, but not in newer next.js versions
// see https://github.com/vercel/next.js/discussions/41934

const variants = {
  hidden: { opacity: 0, y: 40 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
}

export function MobileNav() {
  const { menuOpen, toggleMenuOpen } = useMenuContext()

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.section
          variants={variants}
          transition={{ type: 'linear' }}
          initial="hidden"
          animate="enter"
          // initial={{ y: 100 }}
          // animate={{ y: 0 }}
          exit="exit"
          className={cn('absolute bg-background w-full h-full z-50')}
        >
          <div className="flex items-center justify-center min-h-full">
            <ul className="list-none">
              <li className="text-center mb-4">
                <Link href="/" className="text-center mb-4" onClick={() => toggleMenuOpen()}>
                  Home
                </Link>
              </li>

              <li className="text-center mb-4">
                <Link href="/work" className="text-lg" onClick={() => toggleMenuOpen()}>
                  Work
                </Link>
              </li>

              <li className="text-center mb-4">
                <Link href="/articles" className="text-lg" onClick={() => toggleMenuOpen()}>
                  Articles
                </Link>
              </li>

              <li className="text-center mb-4">
                <Link href="/notes" className="text-lg" onClick={() => toggleMenuOpen()}>
                  Notes
                </Link>
              </li>

              <li className="text-center mb-4">
                <Link href="/about" className="text-lg" onClick={() => toggleMenuOpen()}>
                  About
                </Link>
              </li>

              <li className="text-center mb-4">
                <a
                  href="https://github.com/vickOnRails/next-starter-peacock"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>
              </li>
            </ul>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
