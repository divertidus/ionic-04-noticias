import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import {
  IonGrid, IonRow, IonCardSubtitle,
  IonCol, IonCard, IonCardTitle, IonImg,
  IonCardContent, IonButton, IonIcon, IonActionSheet
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import * as ionIcons from 'ionicons/icons';
import { Article } from 'src/app/interfaces';
import { Icon } from 'ionicons/dist/types/components/icon/icon';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true,
  imports: [IonActionSheet, IonIcon, IonButton, IonGrid, IonRow, IonCardSubtitle, IonCol, IonCard, IonCardTitle, IonImg, IonCardContent, NgFor, NgIf],
  providers: [Input]
})
export class ArticleComponent implements OnInit {

  @Input() articulo!: Article;
  @Input() indiceArticulo: number = 0;

  constructor() { addIcons(ionIcons); }
  ngOnInit() { }

  public actionSheetButtons =
    [
      {
        text: "Compartir",
        icon: "share-outline",
        data: {},
        handler: () => this.accionHandler('compartir')
      },
      {
        text: "Favorito",
        icon: "heart-outline",
        data: {},
        handler: () => this.accionHandler('favorito')
      },
      {
        text: "Cancelar",
        icon: "close-outline",
        role: "cancel",
        data: {},
        handler: () => this.accionHandler('cancelar')
      }
    ];

  async onClick() {
    await Browser.open({ url: this.articulo.url })
  }

  accionHandler(opcion: string) {

    switch (opcion) {
      case "compartir":
        console.log("Se pulsa compartir");
        break;

      case "favorito":
        console.log("Se pulsa favorito");
        break;

      case "cancelar":
        console.log("Se pulsa cancelar");
        break;
    }
  }




}
