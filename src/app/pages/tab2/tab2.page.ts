import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, SegmentChangeEventDetail, IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { IonSegmentCustomEvent } from '@ionic/core';
import { NgFor } from '@angular/common';
import { ArticlesComponent } from "../../components/articles/articles.component";
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonItem, IonList, IonLabel, NgFor,
    IonSegmentButton, IonSegment, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, ArticlesComponent]
})
export class Tab2Page implements OnInit {



  constructor(private newsService: NewsService) { }

  public categorias: string[] = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']

  public categoriaSeleccionada = this.categorias[0];

  public arrayArticulosPorCategoria: Article[] = []

  ngOnInit(): void {
    this.cargarArticulos();
  }


  segmentChanged(evento: CustomEvent) {
    this.categoriaSeleccionada = evento.detail.value;
    // De este modo decimos que la categoriaSeleccionada siempre sea en la que se ha hecho click,
    // esto nos viene bien para poder hacer cosas con esa información, no para que se vea
    // visualmente marcada ya que eso lo hace el segment solito.
    console.log(evento.detail.value)

    // Sin esto no se recarga el array porque se muestra el array ya con datos previos y se añaden los nuegos digamos
    this.arrayArticulosPorCategoria = []

    this.cargarArticulos();

  }


  private cargarArticulos() {
    /* Esto de
         this.arrayArticulosPorCategoria = [...this.arrayArticulosPorCategoria, ...articlesRecibidos]
         viene a ser equivalente a la linea comentada debajo. 
          Le dijo que el array será igual a lo que hay en el array y 
          luego añado los articulos del array de articlesRecibidos.
          Lo que viene haciendo tambien el push pero por verlo de otra forma. 
         Como hacemos  = [cosas dentro]
         dentro de los corchetes no meto los arrays, sino su contenido, por eso hago primero ... de modo que
         "desarma" los array usando solo su contenido.
         */
    // this.newsService.getTopHeadLinesByCategory(this.categoriaSeleccionada)
    this.newsService.getTopHeadLinesByCategory(this.categoriaSeleccionada)

      .subscribe(articlesRecibidos => {

        this.arrayArticulosPorCategoria = [...this.arrayArticulosPorCategoria, ...articlesRecibidos]

        /*
        Por tanto, si quiero que no se acumulen, sino que se carguen solo unos u otros, en lugar de hacer en el sergmentChange

        this.arrayArticulosPorCategoria = [] // Esto para vaciarlo y
        this.cargarArticulos(); // Esto para meter de nuevo lo que toque
       
        podría tener this.arrayArticulosPorCategoria = [...articlesRecibidos] 
        en vez de 
        this.arrayArticulosPorCategoria = [...this.arrayArticulosPorCategoria, ...articlesRecibidos]

        pero ahora mismo no podría reutilizar el codigo tal cual de esa forma.
        De todos modos esto no es optimo ya que siempre se están haciendo consultas a la API aun cuando ya tenía la informacion
        previamnente. Lo cambiaremos.
        
        */
        // le digo que en el arrayArticulos meta .(.push) la desestructuracion "..." de los articulos(...articles)
        // this.arrayArticulosPorCategoria.push(...articles); 
        console.log(articlesRecibidos);
      });
  }


  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonSegment) segment!: IonSegment;


  onIonInfinite(event: CustomEvent) {
    this.segmentChanged(event);
    console.log("ahora cargo, tras terminas el contador")
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 5000);
  }

  cargarMasDatos() {
    this.segmentChanged(event);
    console.log("ahora cargo, tras terminas el contador")
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 5000);
  }
}

}

