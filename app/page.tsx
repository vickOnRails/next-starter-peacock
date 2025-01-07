import { Container, Header, Testimonials, WorkItem } from '@components';
import { getContentList } from '@utils/content';
import { Metadata } from 'next';
import { author, site } from '../config/index.json';
import testimonials from '../config/testimonials.json';

/**
 * Index page `/index`
 */

export const metadata: Metadata = {
    title: site.siteTitle,
    keywords: site.keywords.split(','),
    description: site.siteDescription,
    alternates: {
        types: {
            'application/rss+xml': [
                {
                    title: site.siteName,
                    url: `${site.siteUrl}rss.xml`
                }
            ]
        }
    },
    twitter: {
        card: 'summary_large_image',
        creator: author.twitterHandle,
        images: site.siteImage,
    },
    openGraph: {
        title: `${site.siteTitle} | ${site.siteDescription}`,
        description: site.siteDescription,
        url: site.siteUrl,
        images: site.siteImage,
        siteName: site.siteName,
    }
}

const Index = () => {
    const content = getContentList('work')
        .filter((work) => work.selectedWork);

    return (
        <div>
            <Header />
            <Container className="flex flex-col gap-8 mb-20 border-b border-accent-8 pb-9">
                {content.map((work) => (
                    <WorkItem key={work.slug} work={work} />
                ))}
            </Container>
            <Testimonials testimonials={testimonials} />
        </div>
    );
};

export default Index;
