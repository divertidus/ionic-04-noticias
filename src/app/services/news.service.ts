import { HttpClient } from '@angular/common/http'; //este import para el HTTPCLIENT y lo inyectaré en el constructor
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Article, NewsResponse } from '../interfaces'; //como hemos nombrado el archivo index.ts será el que tome por defecto si no establecemos nada mas
import { map } from 'rxjs/operators';
const apiKey = environment.apiKey;
/* De esta forma no podnremos nuestra apiKey directamente en cada una de las peticiones html que hagamos.
Sino que iremos cogiendo el valor del archivo enviroment donde la hemos definido. Debe importarlo de 
import { environment } from 'src/environments/environment';
y no de
import { environment } from 'src/environments/environment.prod';
aunque lo definamos en ambos ya que no estámos unsando produccion ahora ( de ahi el prod).
*/


@Injectable({
  providedIn: 'root'
})
export class NewsService {

  //  Inyectamos en nuestro servicio el HttpClient previa importación arriba.
  //  Esto permite hacer uso del hhtp para traer data. Como es observable se pueden hacee muchas cosas con esa info.
  constructor(private http: HttpClient) { }

  /*
  Hagamos un método para obtener los headers
  Además, es recomendable indicar el tipo que devuelve para evitar errores. En este caso nos debe devolve run Observable generico
  Y en concreto nuestro getTopHeadLines va a retornar el array de Articulos que se encuentra en NewsResponse
  (Recordemos que NewsResponse sería el elemento principal del JSON obtenido en la api y dentro tendrá muchos articulos)
  Entonces debe retornar getTopHeadLines(): Observable<Article[]> {

  Sin embargo ahora tendremos un error en el return de más abajo.
  Para arreglarlo, primero importamos
  import { map } from 'rxjs/operators';
  Y luego aplicaríamos un pipe donde tendríamos respuesta que contiene toda la informacion, y de esa respuesta queremos .articles
  ***IMPORTANTE  a diferencia de .pipe de Angular, este si que transforma la salida, no la data. ***
  seria asi:

       return this.http.get<NewsResponse>(`https://newsapi.org/v2/everything?q=tesla&from=2024-09-02&sortBy=publishedAt`, {
      params: {
        apiKey: apiKey
      }
    }).pipe(map(respuesta => respuesta.articles)) // AQUI usamos el mapeee
      ;
  }
      Eso si, ahora en tab1, tendremos un error donde decíamos

      .subscribe(respuesta => {
        console.log(respuesta.articles[0].title) // La sacamos por consola
      });

      debido a que  "Property 'articles' does not exist on type 'Article[]'."
      Basicamente que en lo que ahora devolvemos (un array de articles) no existe un campo article, asi que le quitamos el .article
      y por ser mas claros renombramos eso de repsuesta a "article"  simplmente
      quedando:

      .subscribe(article => {
        console.log(respuesta[0].title) // La sacamos por consola
      });

      el [0] es si solo queremos el primera articulo claro.

  Hecho eso debemos modificar nuecam
  */

  getTopHeadLines(): Observable<Article[]> {
    // Esto me retornará un Observable, pero recordemos que no se muestra hasta que se hace .subscribe, pero lo haremos en otro sitio.
    // Aqui devolvemos el observable como tal.
    /* Cuando queremos usar la apiKey como variable debemos cambiar las '' por ` `. Ojo con eso. */
    // Sin embargo vamos a colocarlo de otra forma, como parámetro, comentamos esta peticion...
    // return this.http.get(`https://newsapi.org/v2/everything?q=tesla&from=2024-09-02&sortBy=publishedAt&apiKey=${apiKey}`)
    // Y lo mandaremos como parámetro, mediante el uso de la coma tras la url llaves, palabra reservada params, llaves y apikey : apikey 
    // o como en este caso se llama igual podemos dejarlo solo como apiKey. Peor lo dejaremos entero por claridad.
    // Importante que borremos la parte de &apiKey de la URL porque ya va a ir como parametro.
    // En la ayuda de ese get podemos ver que devuelve un generico (esta entre <>) asi que le podemos especificar el tipado como NewsResponse

    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`, {
      params: { apiKey: apiKey }
    }).pipe(
      // map(respuesta => respuesta.articles)
      map(({ articles }) => articles)
    );
    /*
        Aqui, como si ponemos el raton encima de respuesta nos dice que es de tipo NewsResponse, y en la interfaz ya definimos que ese tipo
          contiene "articles"(recordemos:  
                  export interface NewsResponse {
          status: string;
          totalResults: number;
          articles: Article[];
        })
        Podemos en vez de poner map(respuesta => respuesta.articles)) 
        poner
        map(({ articles }) => articles) 
        Lo que hacemos es desestructurar los articulos de ese objeto directamente. Cualquier vale.

        simplemente porque quede mas corto y saber que se hace, más claro. 
        */
  }

  getTopHeadLinesByCategory(category: string): Observable<Article[]> {

    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}`, {
      params: { apiKey: apiKey, }
    }).pipe(
      // map(respuesta => respuesta.articles)
      map(({ articles }) => articles)
    );
  }
}

/*
En este servicio haremos un método que nos sirva para llamar ese URL con la peticion a la api.
Para ello tendremos que usar el httpClient. Y para ello tenemos que decirle a Angular que va a disponer de ese
nuevo elemento


la url:
https://newsapi.org/v2/everything?q=tesla&from=2024-09-02&sortBy=publishedAt&apiKey=cc7732fd79cb4b4fb5ed75878b682efa
*/
