import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import rehypeHighlight from 'rehype-highlight';
import gfm from 'remark-gfm';
import html from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { v4 as uuid } from 'uuid';
import { IContentData } from '../app/[contentType]/[slug]/page';
import { CONTENT_TYPES_MAP } from './content-types';

const workDirectory = path.join(process.cwd(), 'content', 'work');
const notesDirectory = path.join(process.cwd(), 'content', 'notes');
const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

export type IContent = {
  title: string;
  slug: string;
  basePath: string;
  date: Date;
  id: string;
  draft?: boolean;

  selectedWork?: boolean;
  description?: string;
  previewImage?: string;
  tags?: string[];
  category?: string;
}

export type IContentType = 'articles' | 'notes' | 'work';

/**
 * Get IDs of all markdown post
 * @param {string} contentType Type of content to get ids
 */

export const getAllContentIds = (contentType: IContentType) => {
  let filenames;
  let baseDir;

  // determine where to look for content types
  switch (contentType) {
    case 'articles':
      baseDir = articlesDirectory;
      filenames = fs.readdirSync(articlesDirectory);
      break;

    case 'notes':
      baseDir = notesDirectory;
      filenames = fs.readdirSync(notesDirectory);
      break;

    case 'work':
      baseDir = workDirectory;
      filenames = fs.readdirSync(workDirectory);
      break;

    default:
      throw new Error('You have to provide a content type');
  }

  // return the slug of all the content IDs
  return filenames.map((filename) => {
    const filePath = path.join(baseDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const matterResult = matter(fileContent);

    return {
      params: {
        // This is where we switch it up to use slug instead of the filename for generating pages
        // id: filename.replace(/\.md$/, ""),
        id: matterResult.data.slug,
      },
    };
  });
};

/**
 * Get data for a given post id
 * @param {string} id ID of the post being passed
 * @param {string} contentType Type of content
 */

export const getContentData = async (id: string, contentType: IContentType) => {
  let contentTypeDirectory;
  let filenames;
  switch (contentType.toLowerCase()) {
    case 'articles':
      filenames = fs.readdirSync(articlesDirectory);
      contentTypeDirectory = articlesDirectory;
      break;

    case 'notes':
      filenames = fs.readdirSync(notesDirectory);
      contentTypeDirectory = notesDirectory;
      break;

    case 'work':
      filenames = fs.readdirSync(workDirectory);
      contentTypeDirectory = workDirectory;
      break;

    default:
      throw new Error('You have to provide a content type');
  }

  // loop through all the content types and compare the slug to get the filename
  const match = filenames.filter((filename) => {
    const filePath = path.join(contentTypeDirectory, filename);

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const matterResult = matter(fileContent);
    const { slug } = matterResult.data;

    return slug === id;
  });

  // use the returned path to get the fullpath and read the file content
  const fullPath = path.join(contentTypeDirectory, match[0]);
  // const fullPath = path.join(contentTypeDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');

  const matterResult = matter(fileContents);
  const processedContent = await unified()
    .use(remarkParse)
    .use(html, { sanitize: false })
    .use(gfm)
    .use(rehypeHighlight)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    title: matterResult.data.title,
    draft: matterResult.data.draft || false,
    date: matterResult.data.date,
    previewImage: matterResult.data.previewImage || '',
    description: matterResult.data.description || '',
    tags: matterResult.data.tags || [],
    category: matterResult.data.category || '',
    problem: matterResult.data.problem || '',
    techStack: matterResult.data.techStack || [],
  };
};

/**
 * Get content list for a particular content type
 * @param {string} contentType Type of content
 */
export const getContentList = (contentType: IContentType): IContent[] => {
  let contentFiles;
  let contentDir;

  switch (contentType) {
    case 'articles':
      contentFiles = fs.readdirSync(articlesDirectory);
      contentDir = articlesDirectory;

      break;

    case 'notes':
      contentFiles = fs.readdirSync(notesDirectory);
      contentDir = notesDirectory;
      break;

    case 'work':
      contentFiles = fs.readdirSync(workDirectory);
      contentDir = workDirectory;
      break;
  }

  const content = contentFiles
    .filter((content) => content.endsWith('.md'))
    .map((content) => {
      const path = `${contentDir}/${content}`;
      const rawContent = fs.readFileSync(path, {
        encoding: 'utf-8',
      });

      const { data } = matter(rawContent);

      return {
        ...data,
        previewImage: data.previewImage ?? '/images/article-preview.png',
        id: uuid(),
      };
    });

  return content.filter(x => !x.draft).sort(sortByDate);
};

/**
 * Get content type with particular tag
 * @param {string} tag - tag to filter by
 */
export const getContentWithTag = (tag: string, contentType: IContentType) => {
  let contentDir;
  let contentFiles;

  switch (contentType) {
    case 'articles':
      contentDir = articlesDirectory;
      break;

    case 'notes':
      contentDir = notesDirectory;
      break;

    case 'work':
      contentDir = workDirectory;
      break;
  }

  contentFiles = fs.readdirSync(contentDir);

  let contentData = contentFiles
    .filter((content) => content.endsWith('.md'))
    .map((content) => {
      const path = `${contentDir}/${content}`;
      const rawContent = fs.readFileSync(path, {
        encoding: 'utf-8',
      });

      const { data } = matter(rawContent);

      return {
        ...data,
        previewImage: data.previewImage || '/images/image-placeholder.png',
        id: uuid(),
      };
    });

  const filteredContent = contentData.filter((content: IContentData) => {
    return content.tags && content.tags.includes(tag);
  });

  return filteredContent.sort(sortByDate);
};

/**
 * Get content type with particular tag
 * @param {string} tag - tag to filter by
 */
export const getContentInCategory = (
  category: string,
  contentType: IContentType
) => {
  let contentDir;
  let contentFiles;

  switch (contentType) {
    case 'articles':
      contentDir = articlesDirectory;
      break;

    case 'notes':
      contentDir = notesDirectory;
      break;

    case 'work':
      contentDir = workDirectory;
      break;
  }

  contentFiles = fs.readdirSync(contentDir);

  let contentData = contentFiles
    .filter((content) => content.endsWith('.md'))
    .map((content) => {
      const path = `${contentDir}/${content}`;
      const rawContent = fs.readFileSync(path, {
        encoding: 'utf-8',
      });

      const { data } = matter(rawContent);

      return {
        ...data,
        previewImage: data.previewImage || '/images/image-placeholder.png',
        id: uuid(),
      };
    });

  const filteredContent = contentData.filter((content: IContentData) => {
    return content.category && content.category === category;
  });

  return filteredContent.sort(sortByDate);
};

/**
 * Sorts content by their dates
 * @param a {Date} - Date of post 1
 * @param b {Date} - Date of post 2
 */
export const sortByDate = (a, b) => {
  if (a.date > b.date) {
    return -1;
  } else if (a.date < b.date) {
    return 1;
  } else {
    return 0;
  }
};

export const getContentTypes = () => {
  return Array.from(CONTENT_TYPES_MAP.keys());
}