'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md text-sm font-medium"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 z-10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink href="/jobseeker" onClick={() => setIsOpen(false)}>For Developers</MobileNavLink>
            <MobileNavLink href="/employer" onClick={() => setIsOpen(false)}>For Employers</MobileNavLink>
            <MobileNavLink href="/jobs" onClick={() => setIsOpen(false)}>Browse Jobs</MobileNavLink>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={onClick}>
      {children}
    </Link>
  )
}