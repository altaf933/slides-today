import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MDCRipple } from '@material/ripple/dist/mdc.ripple';
import { MDCSimpleMenu } from '@material/menu/dist/mdc.menu';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements AfterViewInit {

  constructor() { }

  _menu: MDCSimpleMenu;
  @ViewChild('fabEl') fabEl;
  @ViewChild('menuEl') menuEl;
  @Input() text: string;
  services = {
    google: () => `https://plus.google.com/share?url=${this.shareUrl()}`,
    twitter: () => `https://twitter.com/intent/tweet?text=${this.shareText() + ' ' + this.shareUrl()}`,
    facebook: () => `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl()}`,
  };

  ngAfterViewInit() {
    this._menu = new MDCSimpleMenu(this.menuEl.nativeElement);
    this.initRipples();
  }

  initRipples(): void {
    MDCRipple.attachTo(this.fabEl.nativeElement);
    // const items = this.menuEl.nativeElement.querySelectorAll('.mdc-list-item:not(.mdc-ripple-upgraded)');
    // Array.from(items).forEach(item => {
    //   MDCRipple.attachTo(item);
    // });
  }

  shareText(): string {
    return encodeURIComponent(this.text);
  }

  shareUrl(): string {
    return encodeURIComponent(window.location.href);
  }

  toggleMenu() {
    this._menu.open = !this._menu.open;
  }

  open(url) {
    window.open(url);
  }

  share(service: string) {
    window.open(this.services[service]());
  }
}