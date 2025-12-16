import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AiStateService, AiMode, AiFeature } from '../../state/ai-state.service';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRadioModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  constructor(private aiState: AiStateService) { }

  onModeChange(mode: AiMode) {
    this.aiState.setMode(mode);
  }

  onFeatureChange(feature: AiFeature) {
    this.aiState.setFeature(feature);
  }

  analyze() {
  this.aiState.runAnalysis();
}
}
