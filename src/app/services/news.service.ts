import { HttpClient } from '@angular/common/http'; //este import para el HTTPCLIENT y lo inyectaré en el constructor
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Article, ArticulosPorCategoriaYPagina, NewsResponse } from '../interfaces'; //como hemos nombrado el archivo index.ts será el que tome por defecto si no establecemos nada mas
import { count, map } from 'rxjs/operators';
const apiKey = environment.apiKey;
const apiUrl = environment.apiURL; // v13 - Importo y creo esto con el inicio de la URL

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

  /* v0.13 Debido a que en el video tiene esto lo creo.  Aunque no lo explica, lo replico.
  Primero en enviromets creo y guardo el principio de la apiURL
  Devolverá un genérico
  Recibe un endpoint que será lo que añada a la url para categoria pagina lo que sea.
  En parametros establezco la apiKey y el pais.

  Hecho esto voy a modificar mis dos metodos que ya tenia el de traer todo y el de categorias
  
  */
  private executeQuery<T>(endpoint: string) {
    console.log('Peticion HTTP realizada desde executeQuery');
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apiKey: apiKey,
        country: 'us',
      }
    })

  }

  /* v.13 En este punto se realizan modificaciones para evitar tener que realizar continuamente consultas
  html de aquella información que ya he obtenido pero sin la necesidad de , por ejemplo, crear una array para cada
  categoria + el general puesto que eso a la larga complica le codigo y las modificaciones o ampliaciones.
  */
  /* De modo que en business por ejemplo tenga un objeto con las propiedades page y un array de articulos. De modo que
  se lea de ahi lo que haya que cargar y no del http en cada vez. Sin embargo lo quiero dinámico, aunque sería válido 
  por ejemplo tener en el tab2.html un ngIf que segun la categoría cargue unos datos u otros.
 
  private articulosPorCategoriaYPagina = {
   business:{
     page:0,
     articles: []
   },
   entertainment:{
     page:0,
     articles: []
   },
  }
 La idea será algo como esto pero genérico, como hablamos de objetos,haremos una interfaz.
 Vease  esta interfaz en index.ts de interfaces:
 
 export interface ArticulosPorCategoriaYPagina {
    [key: string]: {
        page: number;
        articulos: Article[]
    }
}
  */
  private articulosPorCategoriaYPagina: ArticulosPorCategoriaYPagina = {}
  /* Ahora debo modificar el metodo getTopHeadLinesByCategory, ver alli*/



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
    console.log("Peticion http realizada sin categoria que llamo al ExecuteQuery")
    return this.executeQuery<NewsResponse>(`/top-headlines?`).pipe(
      // map(respuesta => respuesta.articles)
      map(({ articles }) => articles)
    );
  }


  // Esto me retornará un Observable, pero recordemos que no se muestra 
  // hasta que se hace .subscribe, pero lo haremos en otro sitio.
  // Aqui devolvemos el observable como tal.
  // Cuando queremos usar la apiKey como variable debemos cambiar las '' por ` `. Ojo con eso. /
  // Sin embargo vamos a colocarlo de otra forma, como parámetro, comentamos esta peticion...
  // return this.http.get(`https://newsapi.org/v2/everything?q=tesla&from=2024-09-02&sortBy=publishedAt&apiKey=${apiKey}`)
  // Y lo mandaremos como parámetro, mediante el uso de la coma tras la url llaves, palabra reservada params, llaves y apikey : apikey 
  // o como en este caso se llama igual podemos dejarlo solo como apiKey. Peor lo dejaremos entero por claridad.
  // Importante que borremos la parte de &apiKey de la URL porque ya va a ir como parametro.
  // En la ayuda de ese get podemos ver que devuelve un generico (esta entre <>) asi que le podemos especificar el tipado como NewsResponse

  /* ------------------ METODO ANTIGUO DEL TOPHEADLINES -------------------

  
  getTopHeadLines(): Observable<Article[]> {
  
     console.log("Peticion http realizada sin categoria")
    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`, {
      params: { apiKey: apiKey }
    }).pipe(
      // map(respuesta => respuesta.articles)
      map(({ articles }) => articles)
    );
   
  }
  */

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

  /*
  v.13 Tras crear  private articlesByCategory: ArticulosPorCategoriaYPagina = {} y la interfaz correspodniente.
  Ahora quiero poder saber si se quiere cargar más información nueva o la que está en memoria
  Para ello crearemos una propiedad nueva boolean que dirá que por defecto no cargue más.  cargarMas: boolean = false
  De modo que si lo omito ya sea false.
  MOdificaremos el contenido del método pero primero crearemos un nuevo metodo debajo  
  -- private getArticulosPorCategoriaYPagina(category: string): Observable<Article[]> 
  */
  getTopHeadLinesByCategory(category: string, cargarMas: boolean = false): Observable<Article[]> {
    console.log("Peticion http realizada por categoria que llamó al executeQuery")
    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}`).pipe(
      // map(respuesta => respuesta.articles)
      map(({ articles }) => articles)
    );
  }

  /*                    --  METODO ANTIGUO -- 
  
  getTopHeadLinesByCategory(category: string, cargarMas: boolean = false): Observable<Article[]> {
    console.log("Peticion http realizada por categoria")
    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}`, {
      params: { apiKey: apiKey, }
    }).pipe(
      // map(respuesta => respuesta.articles)
      map(({ articles }) => articles)
    );
  }
  */

  /*Lo primero que hará será comprobar si ya existe en el objeto articlesByCategory o no.
  */
  private getArticulosPorCategoria(category: string): Observable<Article[]> {

    // Si el objeto existe, queremos obtener la siguiente página:
    // Lo siguiente es propio de JS, pedir ayuda al chatGPT para entenderlo...
    //Busco las llaves de un objeto y compruebo si incluyen la categoria....

    if (Object.keys(this.articulosPorCategoriaYPagina).includes(category)) {
      // if(this.articulosPorCategoriaYPagina[category]){  //seria eqivalente, pero vemos la forma anterior.

      /* Si existe, no hace nada
      De ser así, es que existe, por lo que tomo la pagina actual y le incremento 1.
      Pero en realidad como haremos eso luego simplemente podemos no hacer nada
      this.articulosPorCategoriaYPagina[category].page += 1; 
      */

      /* Si no existe , la crea
      // entonces creo esa entrada */
      // this.articulosPorCategoriaYPagina[category]  será igual aun objeto con página 0 y sin articulos.
      this.articulosPorCategoriaYPagina[category] = {
        page: 0,
        articulos: []
      }


    }

    /*Como tanto si existia como si no hay que incremntar la pagina lo hago aqui en vez de en el afirmativo del if*/
    const page = this.articulosPorCategoriaYPagina[category].page + 1;


    /*Es un return como los otros pero añadiendo la page a la URL*/
    return this.executeQuery<NewsResponse>(`top-headlines?country=us&category=${category}&page=${page}`)
      .pipe(
        // map(respuesta => respuesta.articles)
        map(({ articles }) => articles)
      );

    /*
    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}`, {
      params: { apiKey: apiKey, }
    }).pipe(
      // map(respuesta => respuesta.articles)
      map(({ articles }) => articles)
    );
    */

  }
}

/*  

/*
En este servicio haremos un método que nos sirva para llamar ese URL con la peticion a la api.
Para ello tendremos que usar el httpClient. Y para ello tenemos que decirle a Angular que va a disponer de ese
nuevo elemento


la url:
https://newsapi.org/v2/everything?q=tesla&from=2024-09-02&sortBy=publishedAt&apiKey=cc7732fd79cb4b4fb5ed75878b682efa
*/
