import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, SegmentChangeEventDetail } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { IonSegmentCustomEvent } from '@ionic/core';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonLabel, NgFor, IonSegmentButton, IonSegment, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent]
})
export class Tab2Page {


  constructor() { }

  public categorias: string[] = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']

  public categoriaSeleccionada = this.categorias[0];

  segmentChanged(categoria: CustomEvent) {
    console.log("Se recibe en el metodo segmentChanged la categoria como string : " + categoria.detail)
  }

}

