import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { MenuService } from 'src/app/angular-app-services/menu.service';
import { TooltipService } from 'src/app/angular-app-services/tooltip.service';
import { LogoutComponent } from 'src/app/logout/logout.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit, OnDestroy {
  isSidebarToggled = true;
  menuData: any;

  private destroy = new Subject();

  constructor(
    private menuService: MenuService,
    public dialog: MatDialog,
    private tooltipService: TooltipService
  ) { }

  ngOnInit(): void {
    this.menuService.getMenu()
      ?.pipe(takeUntil(this.destroy))
      .subscribe(data => {
        this.menuData = data;
      });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
    this.destroy.next(true);
    this.destroy.complete();
  }

  showSubMenu(event: MouseEvent): void {
    const targetAttr = (event.target as HTMLElement),
      subMenuItem = (targetAttr.querySelector('.sub-nav-link') as HTMLElement),
      rect = targetAttr.getBoundingClientRect();

    if (subMenuItem) {
      const subMenuRect = subMenuItem.getBoundingClientRect();

      // Calculate adjusted position
      let left = rect.left + rect.width - 2; // Adjusted left position
      let top = rect.top;                     // Adjusted top position

      // Get viewport dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Check if sub-nav-link will go out of viewport on the right
      if (left + subMenuRect.width > windowWidth) {
        left = windowWidth - subMenuRect.width;
      }

      // Check if sub-nav-link will go out of viewport on the bottom
      if (top + subMenuRect.height > windowHeight) {
        top = windowHeight - subMenuRect.height;
      }

      subMenuItem.style.top = `${top}px`;
      subMenuItem.style.left = `${left}px`;
    }
  }

  isTooltipDisabled(element: HTMLElement): boolean {
    return this.tooltipService.isTooltipDisabled(element);
  }

  openLogoutDialog(event: any) {
    const targetAttr = event?.target?.getBoundingClientRect(),
      dialogConfig = new MatDialogConfig();

    dialogConfig.position = {
      left: targetAttr?.x + targetAttr?.width + 15 + 'px',
      bottom: '15px'
    };

    this.dialog.open(LogoutComponent, {
      width: '250px',
      panelClass: 'logout-dialog-wrapper',
      position: dialogConfig.position,
      autoFocus: false,
      backdropClass: 'no-back-drop',
    });
  }
}
