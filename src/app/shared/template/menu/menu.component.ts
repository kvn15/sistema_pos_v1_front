import { Component, OnInit } from '@angular/core';
import { menu } from 'src/app/config/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  listaMenu: any[] = [];
  permission: any[] = [];

  constructor() {
    this.permission = JSON.parse(localStorage.getItem('role_permission')!).permission
    this.listaMenu = menu;
  }

  ngOnInit(): void {
  }

  verificarMenuRole(roles: any[]): boolean {

    if (this.permission.find( p => roles.includes(p)) ) {
      return true
    }

    return false
  }
}
