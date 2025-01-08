import { IContent } from '@utils/content';
import Link from 'next/link';
import React from 'react';
import { Calendar } from 'react-feather';

export function Note({ date, title, slug, basePath }: IContent) {
  return (
    <Link href={`/${basePath}/${slug}`} className="cursor-pointer no-underline hover:underline">
      <article className="flex flex-col mb-4 sm:mb-0 sm:flex-row sm:items-center">
        <time className="flex w-52 text-sm items-center">
          <span className="date-icon">
            <Calendar className="text-[#808080] mr-3" size={16} />
          </span>
          <p className="text-[#808080] m-0">{date.toString()}</p>
        </time>
        <h2 className="sm:text-2xl text-xl mb-2">{title}</h2>
      </article>
    </Link>
  );
};