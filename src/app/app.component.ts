import { Component } from '@angular/core';

declare var $:any;
declare function initPage([]):any;
declare function dataAnalytics([]):any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sistema_pos_v1_front';

  ngOnInit(): void {
    // Simular recarga de pagina para ejecutar el Jquery
    // setTimeout(() => {
    //   initPage($);
    //   dataAnalytics($);
    // }, 50);
  }

}
