import { Component, OnInit } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { LoaderService } from './angular-app-services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    protected loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    const title = document.querySelector('head > title') as HTMLTitleElement;
    title.innerText = AppConfigService.appConfig.app.title;
  }
}
