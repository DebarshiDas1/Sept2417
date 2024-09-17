import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../angular-app-services/token.service';
import { TooltipService } from '../angular-app-services/tooltip.service';
import { User } from '../auth/user';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../angular-app-services/theme.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [MatTooltipModule, MatSlideToggleModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  isThemeChecked!: boolean;
  user!: User;

  constructor(
    protected themeService: ThemeService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private router: Router,
    private tokenService: TokenService,
    private tooltipService: TooltipService
  ) {
  }

  ngOnInit(): void {
    this.isThemeChecked = this.themeService.activeTheme === 'dark';
    this.populateUserProfile();
  }

  logout(): void {
    this.tokenService.logout();
    this.dialog.closeAll();
    // this.ngZone.run(() => {
    //   this.router.navigate(['']).then(() => window.location.reload());
    // });
  }

  isTooltipDisabled(element: HTMLElement): boolean {
    return this.tooltipService.isTooltipDisabled(element);
  }

  public toggleTheme(): void {
    this.isThemeChecked = !this.isThemeChecked;
    const active = this.themeService.activeTheme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(active);
  }

  private populateUserProfile(): void {
    this.user = this.tokenService.getUserDetails();
  }
}
