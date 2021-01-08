import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {

  constructor() { }
  
  toggleDisplayMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
    this.toggleDarkTheme(prefersDark.matches);
  }
  // Add or remove the "dark" class based on if the media query matches
  toggleDarkTheme(shouldAdd) {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
