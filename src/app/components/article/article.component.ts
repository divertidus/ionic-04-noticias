import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import {
  IonGrid, IonRow, IonCardSubtitle,
  IonCol, IonCard, IonCardTitle, IonImg, IonCardContent
} from "@ionic/angular/standalone";
import { Article } from 'src/app/interfaces';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCardSubtitle, IonCol, IonCard, IonCardTitle, IonImg, IonCardContent, NgFor, NgIf],
  providers: [Input]
})
export class ArticleComponent implements OnInit {

  async onClick() {
    await Browser.open({ url: this.articulo.url })
  }

  @Input() articulo!: Article;
  @Input() indiceArticulo: number = 0;

  constructor() { }

  ngOnInit() { }

}
