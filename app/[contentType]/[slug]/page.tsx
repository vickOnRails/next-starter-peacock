import { Chips, Container } from '@components';
import {
  getContentData,
  getContentList,
  getContentTypes,
  IContentType,
} from '@utils/content';
import { CONTENT_TYPES_MAP } from '@utils/content-types';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import BackButton from '../../../components/back-button';
import { author, site } from '../../../config/index.json';
import Content from './content';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { title, previewImage, description } = await getContentData(params.slug, params.contentType)
    return {
        title: `${title} | ${site.siteTitle}`,
        description: description ?? site.siteDescription,
        openGraph: {
            title: `${title} | ${site.siteName}`,
            description: description ?? site.siteDescription,
            url: site.siteUrl,
            images: previewImage ?? site.siteImage,
            siteName: site.siteName,
        },
        twitter: {
            card: 'summary_large_image',
            creator: author.twitterHandle,
            images: previewImage ?? site.siteImage
        }
    }
}

/**
 * statically generate all content pages
 */
export async function generateStaticParams() {
    const contentTypes = getContentTypes();

    return contentTypes.map(contentType => {
        const contentList = getContentList(contentType);
        return contentList.map(({ slug }) => {
            return {
                contentType,
                slug
            }
        })
    }).flat()
}

/**
 *  Renders articles markdown posts
 */

async function fetchContentData(slug: string, contentType: IContentType) {
    return await getContentData(slug, contentType)
}

type Params = {
    slug: string
    contentType: IContentType
}

export default async function ContentPage({ params }: { params: Params }) {
    const { slug, contentType } = params;

    if (!CONTENT_TYPES_MAP.has(contentType)) {
        return notFound();
    }

    const content = await fetchContentData(slug, contentType);
    if (content.draft) return notFound();

    if (contentType === 'work') return <WorkPage work={content} />

    return (
        <Container width="narrow">
            <header>
                <section className="pt-16">
                    <h1 className="my-0 font-bold font-display mb-2 text-2xl/normal md:text-4xl max-w-xl">{content.title}</h1>
                    <time className="block text-accent-4 mb-8">{content.date.toString()}</time>
                    {content.previewImage && (
                        <Image className="pb-8 block object-cover" src={content.previewImage} height={550} width={1200} alt="" />
                    )}
                </section>
            </header>

            <Content html={content.contentHtml} />
            {content.tags && <Chips items={content.tags} />}
        </Container>

    );
};

function WorkPage({ work }: { work: IContentData }) {

    return (
        <Container className="flex flex-col lg:flex-row gap-4 pt-12">
            <section className="w-full lg:w-1/3 border-r border-accent-8 p-2 pr-8">
                <div className="mb-8 flex flex-col items-start gap-5">
                    <BackButton />
                    <h1 className="text-4xl font-bold font-display text-accent-3">{work.title}</h1>
                    <p className="text-accent-4">{work.description}</p>
                    <button>Se Demo</button>
                </div>

                <ul>
                    <TechStack techStack={work.techStack ?? []} />
                    <MetadataListItem item="Date" value={work.date.toString()} />
                    {work.problem && <MetadataListItem item="Problem" value={work.problem ?? ''} />}
                </ul>

            </section>

            <section className="w-full lg:w-2/3 p-2">
                <Image src={work.previewImage ?? ''} height={1000} width={1000} alt="" className="mb-4" />
                <Content html={work.contentHtml} />
            </section>

        </Container>
    )
}

function MetadataListItem({ item, value }: { item: string, value: string }) {
    return (
        <li className="list-none flex gap-4 border-b border-accent-8 py-3 text-sm">
            <span className="text-accent-4 w-1/3">{item}</span>
            <span className="w-2/3 text-accent-2">{value}</span>
        </li>

    )
}

function TechStack({ techStack }: { techStack: string[] }) {
    if (!techStack.length) return null
    return (
        <li className="list-none flex gap-4 border-b border-accent-8 py-3 text-sm">
            <span className="text-accent-4 w-1/3 flex-shrink-0">Tech Stack</span>

            <ul className="flex flex-wrap gap-2 flex-grow-0">
                {techStack.map(tech =>
                    <li key={tech} className="select-none bg-accent-8 text-accent-2 px-2 py-1 rounded-md">{tech}</li>
                )}
            </ul>
        </li>
    )
}

export interface IContentData {
    id: string;
    contentHtml: string;
    date: Date;
    title: string;
    previewImage?: string;
    description?: string;
    tags?: string[];
    category?: string;
    problem?: string;
    techStack?: string[];
}