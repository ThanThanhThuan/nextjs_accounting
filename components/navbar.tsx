"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Journal Entry', href: '/' },
        { name: 'General Ledger', href: '/ledger' },
        { name: 'Trial Balance', href: '/trial-balance' }, // 👈 ADD THIS
    ];

    return (
        <nav className="bg-white border-b shadow-sm p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Brand Name */}
                <div className="font-bold text-xl flex items-center gap-2">
                    <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded">L</div>
                    <span>ModernLedger</span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-600 text-white shadow-md' // Active Style
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Inactive Style
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}