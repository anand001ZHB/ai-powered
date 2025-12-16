import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';

export type AiMode = 'generative' | 'agentic';
export type AiFeature = 'explain' | 'review' | 'debug';


@Injectable({
  providedIn: 'root'
})
export class AiStateService {

  constructor(private http: HttpClient, private zone: NgZone) { }

  private modeSubject = new BehaviorSubject<AiMode>('generative');
  mode$ = this.modeSubject.asObservable();

  setMode(mode: AiMode) {
    this.modeSubject.next(mode);
  }

  private featureSubject = new BehaviorSubject<AiFeature>('explain');
  feature$ = this.featureSubject.asObservable();

  setFeature(feature: AiFeature) {
    this.featureSubject.next(feature);
  }

  private outputSubject = new BehaviorSubject<string[]>([]);
  output$ = this.outputSubject.asObservable();

  private codeSubject = new BehaviorSubject<string>('');
  code$ = this.codeSubject.asObservable();

  setCode(code: string) {
    this.codeSubject.next(code);
  }

  private eventSource?: EventSource;

  // NEW: simulate analysis
  // runAnalysis() {
  //   const mode = this.modeSubject.value;
  //   const feature = this.featureSubject.value;

  //   this.outputSubject.next([])

  //   if (mode === 'generative') {
  //     this.outputSubject.next([
  //       `Generated ${feature} explanation in one step.`
  //     ]);
  //   } else {
  //     const steps = [
  //       'Step 1: Understanding input',
  //       'Step 2: Planning actions',
  //       'Step 3: Executing tools',
  //       'Step 4: Final response'
  //     ];

  //     steps.forEach((step, index) => {
  //       setTimeout(() => {
  //         const current = this.outputSubject.value;
  //         this.outputSubject.next([...current, step]);
  //       }, (index + 1) * 800);
  //     });
  //   }
  // }

  // runAnalysis() {
  //   // ✅ Close previous stream if any
  //   console.log('Agent API URL:', environment.agentApiUrl);
  //   if (this.eventSource) {
  //     this.eventSource.close();
  //   }

  //   this.outputSubject.next([]);

  //   this.eventSource = new EventSource(
  //     `${environment.agentApiUrl}/agent/stream`
  //   );

  //   this.eventSource.onmessage = (event) => {
  //     this.zone.run(() => {
  //       if (event.data === 'DONE') {
  //         this.eventSource?.close();
  //         return;
  //       }

  //       const current = this.outputSubject.value;
  //       this.outputSubject.next([...current, event.data]);
  //     });
  //   };


  //   this.eventSource.onerror = () => {
  //     this.zone.run(() => {
  //       this.eventSource?.close();
  //       this.outputSubject.next([
  //         ...this.outputSubject.value,
  //         'Error: connection lost'
  //       ]);
  //     });
  //   };

  // }

  runAnalysis() {
    // 1. Reset previous output
    this.outputSubject.next([]);

    // 2. Prepare intent payload for backend
    const payload = {
      mode: this.modeSubject.value,
      feature: this.featureSubject.value,
      input: this.codeSubject.value,

    };

    // 3. Send intent to backend FIRST
    this.http
      .post<{ runId: string }>(
        `${environment.agentApiUrl}/agent/run`,
        payload
      )
      .subscribe({
        next: ({ runId }) => {
          // 4. Start SSE ONLY after runId is received
          this.startStream(runId);
        },
        error: () => {
          this.outputSubject.next(['Error: failed to start agent']);
        }
      });
  }

  private startStream(runId: string) {
    // Close previous stream if any
    if (this.eventSource) {
      this.eventSource.close();
    }

    // Start SSE with runId
    this.eventSource = new EventSource(
      `${environment.agentApiUrl}/agent/stream?runId=${runId}`
    );

    this.eventSource.onmessage = (event) => {
      this.zone.run(() => {
        if (event.data === 'DONE') {
          this.eventSource?.close();
          return;
        }

        const current = this.outputSubject.value;
        this.outputSubject.next([...current, event.data]);
      });
    };

    this.eventSource.onerror = () => {
      this.zone.run(() => {
        this.eventSource?.close();
        this.outputSubject.next([
          ...this.outputSubject.value,
          'Error: connection lost'
        ]);
      });
    };
  }

}
