import { Component } from '@angular/core';
import { ROLES } from '../../constants/roles.constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent{
  public readonly ROLES = ROLES;


  constructor() { }



}
