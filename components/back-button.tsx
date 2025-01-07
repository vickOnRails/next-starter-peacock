'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import { ChevronLeft } from 'react-feather';

export default function BackButton() {
    const router = useRouter()
    return (
        <button className="group flex items-center gap-1 text-accent-3 hover:text-accent-1 active:scale-95" onClick={() => router.push('/work')}>
            <ChevronLeft className="transition-transform group-hover:-translate-x-2" />
            <div>All Projects</div>
        </button>
    )
}
