import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonLabel, IonItem, IonCard, IonCardSubtitle,
  IonCardTitle, IonCardHeader, IonCardContent
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { NewsService } from 'src/app/services/news.service';
//como hemos nombrado el archivo index.ts será el que tome por defecto si no establecemos nada mas
import { NewsResponse } from 'src/app/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCard, IonItem, IonLabel,
    IonList, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page implements OnInit { // le decimos que implemente onInit para implementar y usar ngOnInit

  /*
  Vamos a usar nuestro servicio news asi que tenemos que inyectarlo en el constructor
  Luego lo usaremos en el ngOnInit que como no aparece demos implementar OnInit en la clase
  */
  constructor(private newsService: NewsService) { }

  arrayNoticias!: any
  ngOnInit(): void {

    /*
    De nuestro servicio newsService, llamamos al metood getTopHeadLines() , nos suscribimos 
    y la respuesta la mandamos por consola.
    */
    /*this.arrayNoticias = this.newsService.getTopHeadLines().subscribe;
    console.log(this.arrayNoticias)*/

    this.newsService.getTopHeadLines() //llamo al metodo del servicio, recordemos que devuelve un observable
      // Por tanto nos suscribimos al observable y su respuesta. 
      /* Podríamos decirle que respuesta es del tipo que creamos en la interfaz NewsResponse

     .subscribe((respuesta: NewsResponse) => {
  
      Pero previamente hemos establecido en el servicio que el dato que devuelve nuestro metodo es NewsResponse
      De modo que si dejamos el raton encima del "respuesta" que está en el .subscribe(respuesta) veremos que ya es de ese tipo
      return this.http.get<NewsResponse>(`https://newsa..... */
      .subscribe(article => {
        console.log(article) // La sacamos por consola
      });

  }


}
