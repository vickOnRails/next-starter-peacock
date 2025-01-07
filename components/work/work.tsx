import placeholderImg from '/public/images/placeholder.jpg';
import { cn } from '@utils/cn';
import { IContent } from '@utils/content';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'react-feather';

// TODO: use some type of hash function to generate the colors
const COLORS_LOOKUP = {
    'code-collab': 'bg-accent-delight text-white',
    'health-track': 'bg-accent-8',
    'task-buddy': 'bg-accent-bob text-white',
}

export function WorkItem({ work, grid }: { work: IContent, grid?: boolean }) {
    if (grid) return <WorkGridItem work={work} />

    const { title, slug, description } = work
    return (
        <Link href={`/work/${slug}`} className={cn('group rounded-xl select-none no-underline flex flex-col lg:py-10 w-full md:flex-row transition-transform hover:cursor-pointer hover:scale-[102%] active:scale-95', COLORS_LOOKUP[slug])}>
            <section className="flex flex-col flex-1 lg:order-2">
                <Image className="w-full rounded-t-md lg:rounded-none" src={work.previewImage ?? placeholderImg} alt="" width={500} height={300} />
            </section>

            <section className="flex flex-1 p-4 lg:px-12">
                <div className="max-w-md flex flex-col gap-4 justify-center">
                    <h2 className="font-bold text-2xl font-display">{title}</h2>
                    <p className="description opacity-75">{description}</p>

                    <div className="flex gap-1 items-center text-sm lg:text-base">
                        <ArrowRight size={18} />
                        <span>More Info</span>
                    </div>
                </div>
            </section>
        </Link>
    )
}

function WorkGridItem({ work }: { work: IContent }) {
    const { title, slug, description } = work

    return (
        <Link href={`/work/${slug}`} className="group rounded-md no-underline select-none transition-transform hover:cursor-pointer hover:scale-[102%] bg-accent-8 w-full lg:w-[30%] active:scale-95">
            <section>
                <Image className="w-full rounded-t-md" src={work.previewImage ?? placeholderImg} alt="" width={300} height={150} />
            </section>

            <section className="flex flex-1 p-4">
                <div className="max-w-md flex flex-col gap-2 justify-center">
                    <h2 className="font-bold text-base text-accent-1">{title}</h2>
                    <p className="description text-sm text-accent-4 mb-2">{description}</p>

                    <div className="flex gap-1 text-sm items-center">
                        <ArrowRight size={18} />
                        <span>More Info</span>
                    </div>
                </div>
            </section>

        </Link>
    )
}