import { Component } from '@angular/core';
import { HeaderC } from '../../../component/Coach/header-c/header-c';
import { DashC } from '../../../component/Coach/page-Dashboard/dash-c/dash-c';


@Component({
  selector: 'app-dashboard-c',
  imports: [HeaderC,DashC],
  templateUrl: './dashboard-c.html',
  styleUrl: './dashboard-c.css'
})
export class DashboardC {

}
