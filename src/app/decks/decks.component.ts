import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { Deck } from '../deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
  providers: [DeckService],
})

export class DecksComponent implements OnInit {
  constructor(private deckService: DeckService,
              private route: ActivatedRoute,
              private location: Location) { }

  decks: Deck[];
  currentTag: string;
  tags: string[] = [];
  hasDecks = true;

  @ViewChild('mainEl') mainEl;

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.triggerScroll();
        return Promise.resolve(params.get('tag'));
      })
      .subscribe(tag => {
        this.currentTag = tag;
        this.setHasDecks();
        this.transitionIn();
      });
    this.getTags();
    this.getDecks();
  }

  transitionIn(): void {
    this.mainEl.nativeElement.classList.add('transitioned');
  }

  triggerScroll(): void {
    window.dispatchEvent(new Event('scroll'));
  }

  hidden(deck): boolean {
    return this.currentTag && !deck.tags.includes(this.currentTag);
  }

  setHasDecks(): void {
    // this.hasDecks = document.querySelectorAll('app-deck:not(.hidden)').length > 0;
    this.hasDecks = true;
  }

  getDecks(): void {
    this.deckService.getDecks().then((decks) => {
      this.decks = decks;
    });
  }

  getTags(): void {
    this.deckService.getDecks().then((decks) => {
      const working: string[] = [];
      decks.map((deck) => {
        deck.tags.map((tag) => {
          if (!working.includes(tag)) {
            working.push(tag);
          }
        });
      });
      this.tags = working.sort();
    });
  }
}
