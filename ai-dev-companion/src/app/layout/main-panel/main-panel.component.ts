import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AiStateService } from '../../state/ai-state.service';

@Component({
  selector: 'app-main-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent {

  mode$ = this.aiState.mode$;
  feature$ = this.aiState.feature$;
  output$ = this.aiState.output$;

  constructor(private aiState: AiStateService) { }

  onCodeChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.aiState.setCode(value);
  }


}
