import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgFor],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  listLinks = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Search',
      link: '/search',
    },
  ];
}
