import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

@Injectable()
export class PermissionsService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {
  }

  /**
   * Checks if the user is authorized to activate the route.
   * Returns an Observable with the authorization result.
   */
  canActivate(state: RouterStateSnapshot): Observable<boolean> {
    const token = this.tokenService.getTokenInfo(),
      url: string = state.url;
    // If token data exist, user may log in to the application
    if (token.value && !this.tokenService.isAuthTokenExpired(token.value)) {
      return of(true);
    }
    // Token expired
    if (this.tokenService.isRefreshTokenExpired()) {
      this.tokenService.logout();
      this.router.navigate(['login'], { queryParams: { returnUrl: url } });
      return of(false);
    } else if (this.tokenService.getRefreshToken() && !this.tokenService.tokenGettingRefreshed) {
      this.tokenService.tokenGettingRefreshed = true;
      const refreshToken = this.tokenService.getRefreshToken() ?? '';

      return this.authService.refreshToken(refreshToken).pipe(
        switchMap((data: any) => {
          if (data) {
            this.tokenService.setToken(data);
            this.tokenService.tokenGettingRefreshed = false;
            return of(true);
          }
          return of(false);
        }),
        catchError(() => {
          this.tokenService.tokenGettingRefreshed = false;
          this.tokenService.logout();
          this.router.navigate(['login'], { queryParams: { returnUrl: url } });
          return of(false);
        })
      );
    }
    this.tokenService.logout();
    this.router.navigate(['login'], { queryParams: { returnUrl: url } });
    return of(false);
  }
}

/**
 * Checks if the user is authorized to activate the route.
 */
export const canActivateTeam: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsService).canActivate(state);
};
