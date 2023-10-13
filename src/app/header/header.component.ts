import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {
  sidebarOpen = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));

  constructor(private router: Router, private breakpointObserver: BreakpointObserver,
    @Inject(DOCUMENT) public document: Document, public auth: AuthService) {}

  ngOnInit() {
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  
}
