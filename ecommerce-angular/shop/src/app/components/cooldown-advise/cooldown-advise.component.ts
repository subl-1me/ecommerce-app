import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ServerService } from 'src/app/services/server.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cooldown-advise',
  templateUrl: './cooldown-advise.component.html',
  styleUrls: ['./cooldown-advise.component.css'],
})
export class CooldownAdviseComponent implements OnInit {
  public isProd: boolean = false;
  constructor(private _serverService: ServerService) {}

  ngOnInit(): void {
    this.startWakeUpFlow();
    this.isProd = environment.production;
  }

  isServerWaking = false;
  currentStep = 0;

  private async startWakeUpFlow(): Promise<void> {
    if (!this.isProd) return;
    this.isServerWaking = true;
    this.currentStep = 1;

    const response = await lastValueFrom(this._serverService.getDeepStatus());
    if (response.status !== 'healthy') {
      alert('Server status: ' + response.status);
      return;
    }

    this.currentStep = 2;
    setTimeout(() => {
      // some fancy cooldown
      this.stopWakeUpFlow();
    }, 1500);
  }

  private stopWakeUpFlow() {
    this.isServerWaking = false;
    this.currentStep = 0;
  }
}
