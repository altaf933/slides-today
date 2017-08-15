import { Injectable } from '@angular/core';
import { Deck } from './deck';
import { DECKS } from './decks.data';

@Injectable()
export class DeckService {
  getDecks(): Promise<Deck[]> {
    return Promise.resolve(DECKS);
  }
}