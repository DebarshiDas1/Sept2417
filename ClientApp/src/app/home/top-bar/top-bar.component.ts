import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/angular-app-services/token.service';
import { TooltipService } from 'src/app/angular-app-services/tooltip.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
  user!: User;
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private tooltipService: TooltipService
  ) {
  }
  ngOnInit(): void {
    this.populateUserProfile();
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['']);
  }

  isTooltipDisabled(element: HTMLElement): boolean {
    return this.tooltipService.isTooltipDisabled(element);
  }

  private populateUserProfile(): void {
    this.user = this.tokenService.getUserDetails();
  }
}
