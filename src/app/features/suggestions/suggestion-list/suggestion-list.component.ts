import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrl: './suggestion-list.component.css'
})
export class SuggestionListComponent implements OnInit {
  searchText: string = '';
  favorites: Suggestion[] = [];
  suggestions: Suggestion[] = [];

  constructor(
    private suggestionService: SuggestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.suggestionService.getSuggestionsList().subscribe((data) => {
      this.suggestions = data;
    });
  }

  likeSuggestion(s: Suggestion) {
    this.suggestionService.updateNbLikes(s).subscribe((updated) => {
      s.nbLikes = updated.nbLikes;
    });
  }

  deleteSuggestion(s: Suggestion) {
    this.suggestionService.deleteSuggestion(s.id).subscribe(() => {
      this.suggestions = this.suggestions.filter((item) => item.id !== s.id);
      this.router.navigate(['/suggestions']);
    });
  }

  addToFavorites(s: Suggestion) {
    if (!this.favorites.includes(s)) {
      this.favorites.push(s);
    }
  }

  filteredSuggestions() {
    return this.suggestions.filter(s =>
      s.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.category.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
