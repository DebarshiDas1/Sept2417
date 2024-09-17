import { Injectable, EventEmitter, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable()
export class ThemeService {
    public themeChange = new EventEmitter<string>();
    public activeTheme: string = 'light';

    private renderer: Renderer2;

    constructor(rendererFactory: RendererFactory2) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        let browserTheme = 'light';

        if (prefersDarkMode.matches) {
            browserTheme = 'dark';
        }

        const storedTheme = localStorage.getItem('selectedTheme') ?? browserTheme;
        this.renderer = rendererFactory.createRenderer(null, null);
        this.setTheme(storedTheme); // Apply the initial theme
    }

    public setTheme(name: string): void {
        this.renderer.removeClass(document.body, `${this.activeTheme}-theme`);
        this.renderer.addClass(document.body, `${name}-theme`);

        this.renderer.setAttribute(document.getElementById('theme-style'), 'href', `${name}.css`);

        this.activeTheme = name;
        localStorage.setItem('selectedTheme', this.activeTheme);
        this.themeChange.emit(this.activeTheme);
    }
}