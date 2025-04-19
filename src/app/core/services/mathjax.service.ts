import {Injectable} from '@angular/core';

declare global {
    interface Window {
        MathJax: any;
    }
}

@Injectable({
    providedIn: 'root'
})
export class MathjaxService {
    private readonly mathJaxReady: Promise<void>;

    constructor() {
        this.mathJaxReady = new Promise((resolve) => {
            if (window.MathJax) {
                resolve();
                return;
            }
            window.MathJax = {
                // loader: {load: ['[tex]/noerrors']},
                options: {
                    enableMenu: false,
                },
                tex: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']],
                    // packages: {'[+]': ['noerrors']},
                    processEscapes: true
                },
                chtml: {
                    scale: 1,
                    minScale: 1,
                    matchFontHeight: false
                }
            };

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
            script.async = true;
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    }

    async renderMath() {
        await this.mathJaxReady;
        return await window.MathJax.typesetPromise();
    }
}
