import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highlight-text',
  standalone: true,
  imports: [CommonModule],
  template: `<span [innerHTML]="highlighted"></span>`
})
export class HighlightTextComponent implements OnChanges {
  @Input() text = '';
  @Input() search = '';

  highlighted = '';

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.search?.trim()) {
      this.highlighted = this.escapeHtml(this.text);
      return;
    }
    const escaped = this.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    this.highlighted = this.escapeHtml(this.text).replace(
      regex,
      '<mark class="highlight">$1</mark>'
    );
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
