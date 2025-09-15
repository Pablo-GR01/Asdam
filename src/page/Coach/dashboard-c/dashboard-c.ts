import { Component } from '@angular/core';
import { HeaderC } from '../../../component/Coach/header-c/header-c';
import { EnteteC2 } from '../../../component/Coach/page-Dashboard/entete-c2/entete-c2';

@Component({
  selector: 'app-dashboard-c',
  imports: [HeaderC,EnteteC2],
  templateUrl: './dashboard-c.html',
  styleUrl: './dashboard-c.css'
})
export class DashboardC {

}
