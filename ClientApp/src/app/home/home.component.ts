import { Component } from '@angular/core';
import { ThemeService } from '../angular-app-services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(protected themeService: ThemeService) { }

}
