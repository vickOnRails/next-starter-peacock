'use client'
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import React, { useEffect } from 'react';

export default function Content({ html }: { html: string }) {
    useEffect(() => {
        hljs.registerLanguage('javascript', javascript)
        hljs.highlightAll();
    }, []);

    return (
        <div className="content-body mb-8" dangerouslySetInnerHTML={{ __html: html }} />
    )
}
