import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AiMode = 'generative' | 'agentic';
export type AiFeature = 'explain' | 'review' | 'debug';

@Injectable({
  providedIn: 'root'
})
export class AiStateService {
  private modeSubject = new BehaviorSubject<AiMode>('generative');
  private featureSubject = new BehaviorSubject<AiFeature>('explain');

  mode$ = this.modeSubject.asObservable();
  feature$ = this.featureSubject.asObservable();

  setMode(mode: AiMode) {
    this.modeSubject.next(mode);
  }

  setFeature(feature: AiFeature) {
    this.featureSubject.next(feature);
  }

  // NEW: output stream
  private outputSubject = new BehaviorSubject<string[]>([]);
  output$ = this.outputSubject.asObservable();

  // NEW: simulate analysis
  runAnalysis() {
    const mode = this.modeSubject.value;
    const feature = this.featureSubject.value;

    this.outputSubject.next([])

    if (mode === 'generative') {
      this.outputSubject.next([
        `Generated ${feature} explanation in one step.`
      ]);
    } else {
      const steps = [
        'Step 1: Understanding input',
        'Step 2: Planning actions',
        'Step 3: Executing tools',
        'Step 4: Final response'
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          const current = this.outputSubject.value;
          this.outputSubject.next([...current, step]);
        }, (index + 1) * 800);
      });
    }
  }

}
