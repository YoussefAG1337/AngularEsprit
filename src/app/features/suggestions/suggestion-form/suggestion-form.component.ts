import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrl: './suggestion-form.component.css'
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  id?: number;
  suggestion?: Suggestion;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  private titleRegex = /^[A-Z][a-zA-Z]*$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actR: ActivatedRoute,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.titleRegex)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }), disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });

    this.id = Number(this.actR.snapshot.params['id']);
    if (this.id) {
      this.suggestionService.getSuggestionById(this.id).subscribe((data) => {
        this.suggestion = data;
        const patchData = {
          ...data,
          date: data.date ? new Date(data.date as any).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''
        };
        this.suggestionForm.patchValue(patchData);
      });
    }
  }

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      const formValue = this.suggestionForm.getRawValue();
      const date = this.suggestion?.date ? new Date(this.suggestion.date as any) : new Date();
      const suggestionData = {
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        date,
        status: this.suggestion?.status || 'en attente',
        nbLikes: this.suggestion?.nbLikes ?? 0
      };

      if (this.id && this.suggestion) {
        this.suggestionService.updateSuggestion({
          id: this.id,
          ...suggestionData
        }).subscribe(() => {
          this.router.navigate(['/suggestions']);
        });
      } else {
        this.suggestionService.addSuggestion({
          title: formValue.title,
          description: formValue.description,
          category: formValue.category,
          date: new Date(),
          status: 'en attente',
          nbLikes: 0
        }).subscribe(() => {
          this.router.navigate(['/suggestions']);
        });
      }
    }
  }

  get title() {
    return this.suggestionForm.get('title');
  }

  get description() {
    return this.suggestionForm.get('description');
  }

  get category() {
    return this.suggestionForm.get('category');
  }
}
