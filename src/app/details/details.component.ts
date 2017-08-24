import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Deck } from '../deck';
import { DeckService } from '../deck.service';
import { Link } from '../link';
import { Tag } from '../tag';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DeckService, TagService],
})
export class DetailsComponent implements OnInit {

  constructor(private deckService: DeckService,
              private tagService: TagService,
              private route: ActivatedRoute,
              private location: Location,
              private router: Router) { }

  @Input() deck: Deck;
  @Output() onColorsChange = new EventEmitter<{ color: string, backgroundColor: string }>();

  @ViewChild('detailsEl') detailsEl;
  @ViewChild('mainEl') mainEl;

  currentTag: string;
  primaryTag: Tag;
  title = '';
  defaultImage = '/assets/img/default.png';
  mapUrl: string;
  embeds: Link[];
  embedWidth: number;
  colors: { color: string, backgroundColor: string };

  private key = 'AIzaSyBxTKLxL_bTN7s2U85AgzhDSBh3EoobixY';
  private size = '640x320';
  private zoom = '9';
  private maptype = 'terrain';
  private apiUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  private mapStyles = [
    'feature:administrative.land_parcel%7Cvisibility:off',
    'feature:administrative.neighborhood%7Cvisibility:off',
    'feature:landscape.man_made%7Celement:geometry.fill%7Chue:0x0cff00%7Csaturation:100%7Clightness:0%7Cgamma:0.42',
    'feature:landscape.natural.landcover%7Celement:geometry.fill%7Ccolor:0x37bda2',
    'feature:landscape.natural.terrain%7Celement:geometry.fill%7Ccolor:0x37bda2',
    'feature:poi%7Celement:labels.text%7Cvisibility:off',
    'feature:poi.attraction%7Celement:geometry.fill%7Cvisibility:on',
    'feature:poi.business%7Celement:geometry.fill%7Ccolor:0xe4dfd9',
    'feature:poi.business%7Celement:labels.icon%7Cvisibility:off',
    'feature:poi.park%7Celement:geometry.fill%7Ccolor:0x37bda2',
    'feature:road%7Celement:geometry.fill%7Ccolor:0x70b99b%7Cvisibility:on',
    'feature:road%7Celement:geometry.stroke%7Ccolor:0xfafeb8%7Cweight:1.25',
    'feature:road%7Celement:labels%7Cvisibility:off',
    'feature:road.arterial%7Cvisibility:off',
    'feature:road.highway%7Celement:labels%7Cvisibility:off',
    'feature:road.highway%7Celement:labels.icon%7Cvisibility:off',
    'feature:road.local%7Cvisibility:off',
    'feature:transit.station%7Celement:labels.icon%7Cvisibility:off',
    'feature:water%7Celement:geometry.fill%7Ccolor:0x5ddad6',
    'feature:water%7Celement:labels.text%7Cvisibility:off'
  ];

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        return Promise.all([
          this.deckService.getDeck(params.get('id')),
          this.tagService.getTags(),
        ]);
      })
      .subscribe(all => {
        this.deck = all[0];
        this.primaryTag = all[1].find(tag => tag.id === this.deck.tags[0]);
        this.setMapUrl();
        this.setColors();
        this.setEmbeds();
        this.setEmbedWidth();
        this.transitionIn();
      });
  }

  transitionIn(): void {
    this.mainEl.nativeElement.classList.add('transitioned');
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  open(url: string): void {
    window.open(url);
  }

  setColors(): void {
    this.colors = {
      backgroundColor: this.primaryTag.backgroundColor,
      color: this.primaryTag.color,
    };
    this.onColorsChange.emit(this.colors);
  }

  private center(): string {
    return encodeURIComponent(this.deck.location);
  }

  private styleParams(): string {
    return `style=${this.mapStyles.join('&style=')}`;
  }

  private apiParams(): string {
    return `${this.styleParams()}&maptype=${this.maptype}&zoom=${this.zoom}&size=${this.size}&center=${this.center()}&key=${this.key}`;
  }

  setMapUrl(): void {
    this.mapUrl = `${this.apiUrl}?${this.apiParams()}`;
  }

  setEmbedWidth(): void {
    this.embedWidth = this.detailsEl.nativeElement.offsetWidth;
  }

  setEmbeds(): void {
    const embedServices = ['youtube', 'google-slides'];
    this.embeds = this.deck.links.filter(link => embedServices.includes(link.service));
  }
}
