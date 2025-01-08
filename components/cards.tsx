import { IContent } from '@utils/content';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export interface ICard {
  basePath: string;
  items: IContent[]
}

/**
 * Renders a grid of cards
 * @param {Array} data Data to display in grid
 */

const Cards = ({ items, basePath }: ICard) => {
  return (
    <section className="flex sm:flex-row flex-col flex-wrap justify-start">
      {items.map((singleCard, idx) => (
        <article
          className={
            clsx(
              'article mb-[2%] overflow-hidden group sm:basis-[47%] lg:basis-[32%]',
              (idx === items.length - 1) ? 'sm:mr-0' : 'sm:mr-2'
            )
          }
          key={singleCard.slug}
        >
          <Link
            href={`/${basePath}/${singleCard.slug}`}
            className="no-underline"
          >
            <div className="overflow-hidden max-h-40 mb-2">
              <Image
                src={singleCard.previewImage!}
                alt=""
                width={450}
                height={220}
                sizes="(min-width: 640px) 700px, 400px"
                className="w-full object-cover mb-[0.4rem] transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <time className="text-sm text-accent-4 mb-2 block">
              {singleCard.date.toString()}
            </time>
            <h2
              className="font-bold text-lg mb-1 group-hover:underline max-w-[80%] font-display"
            >
              {singleCard.title}
            </h2>

            {singleCard.description && (
              <p className="transition-transform text-accent-4 group-hover:text-accent-3">
                {singleCard.description}
              </p>
            )}
          </Link>
        </article>
      ))}
    </section>
  );
};

export { Cards };
