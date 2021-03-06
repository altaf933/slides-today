import { Component, ViewChild } from '@angular/core';
import { RoutedComponents } from './app-routing.module';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  defaultTitle = 'Slides.today';
  title = this.defaultTitle;
  defaultColors = { color: '#000', backgroundColor: 'rgb(255, 152, 0)' };
  colors = this.defaultColors;
  fixed = true;

  @ViewChild('headerEl') headerEl!: HeaderComponent;

  onActivate(event: RoutedComponents): void {
    if ('title' in event) {
      this.title = event.title;
    } else {
      this.title = this.defaultTitle;
    }
    if ('onColorsChange' in event) {
      event.onColorsChange.subscribe(this.onColorsChange.bind(this));
    } else {
      this.colors = this.defaultColors;
      this.headerEl.transitionToHome();
      this.setThemeColor();
    }
  }

  onColorsChange(colors: { color: string, backgroundColor: string }): void {
    this.headerEl.transitionToDetails();
    this.colors = colors;
    this.setThemeColor();
  }

  private setThemeColor() {
    if (this.themeEl) {
      this.themeEl.setAttribute('content', this.colors.backgroundColor);
    }
  }

  private get themeEl() {
    return document.querySelector('meta[name="theme-color"]');
  }
}
