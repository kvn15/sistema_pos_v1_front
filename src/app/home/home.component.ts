import { Component, OnInit } from '@angular/core';

declare var $:any;
declare function initPage([]):any;
declare function dataAnalytics([]):any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Simular recarga de pagina para ejecutar el Jquery
    setTimeout(() => {
      initPage($);
      dataAnalytics($);
    }, 50);
  }

}
