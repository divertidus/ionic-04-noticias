import { HttpClient } from '@angular/common/http'; // Importamos HttpClient para hacer peticiones HTTP
import { Injectable } from '@angular/core'; // Decorador para servicios inyectables
import { environment } from 'src/environments/environment'; // Importamos variables de entorno
import { Observable } from 'rxjs'; // Para trabajar con flujos de datos asíncronos
import { Article, ArticulosPorCategoriaYPagina, NewsResponse } from '../interfaces'; // Importamos interfaces personalizadas
import { map } from 'rxjs/operators'; // Operador para transformar datos en un Observable

// Extraemos apiKey y apiUrl de las variables de entorno
const apiKey = environment.apiKey;
const apiUrl = environment.apiURL;

/* De esta forma no pondremos nuestra apiKey directamente en cada una de las peticiones http que hagamos.
Sino que iremos cogiendo el valor del archivo environment donde la hemos definido. */

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class NewsService {

  /* Método genérico para ejecutar consultas HTTP
     T es un tipo genérico que se especificará cuando se llame al método
     endpoint es la parte final de la URL que varía según la consulta */
  private executeQuery<T>(endpoint: string) {
    console.log('Peticion HTTP realizada desde executeQuery');
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apiKey: apiKey, // Añadimos la apiKey como parámetro
        country: 'us', // Configuramos el país para las noticias
      }
    })
  }

  /* Objeto para almacenar artículos por categoría y página
     Esto evita hacer peticiones HTTP repetidas para información ya obtenida */
  private articulosPorCategoriaYPagina: ArticulosPorCategoriaYPagina = {}

  // Constructor del servicio, inyectamos HttpClient
  constructor(private http: HttpClient) { }

  // Método para obtener los titulares principales
  getTopHeadLines(): Observable<Article[]> {
    console.log("Peticion http realizada sin categoria que llamo al ExecuteQuery")
    return this.executeQuery<NewsResponse>(`/top-headlines?`).pipe(
      map(({ articles }) => articles) // Extraemos solo el array de artículos de la respuesta
    );
  }

  // Método para obtener titulares por categoría
  getTopHeadLinesByCategory(category: string, cargarMas: boolean = false): Observable<Article[]> {
    console.log("Peticion http realizada por categoria que llamó al executeQuery")
    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}`).pipe(
      map(({ articles }) => articles) // Extraemos solo el array de artículos de la respuesta
    );
  }

  /* Método privado para obtener artículos por categoría, gestionando la paginación */
  private getArticulosPorCategoria(category: string): Observable<Article[]> {
    // Comprobamos si ya existe la categoría en nuestro objeto
    if (Object.keys(this.articulosPorCategoriaYPagina).includes(category)) {
      // Si existe, no hace nada
      // Esto es equivalente a: if(this.articulosPorCategoriaYPagina[category])
    } else {
      // Si no existe, la crea con valores iniciales
      this.articulosPorCategoriaYPagina[category] = {
        page: 0,
        articulos: []
      }
    }

    // Incrementamos el número de página para la siguiente petición
    const page = this.articulosPorCategoriaYPagina[category].page + 1;

    // Realizamos la petición HTTP para la categoría y página específicas
    return this.executeQuery<NewsResponse>(`top-headlines?country=us&category=${category}&page=${page}`)
      .pipe(
        map(({ articles }) => articles) // Extraemos solo el array de artículos de la respuesta
      );
  }
}

// Código eliminado y comentarios antiguos:

/*
Método antiguo del getTopHeadLines:

getTopHeadLines(): Observable<Article[]> {
  console.log("Peticion http realizada sin categoria")
  return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`, {
    params: { apiKey: apiKey }
  }).pipe(
    map(({ articles }) => articles)
  );
}

Método antiguo del getTopHeadLinesByCategory:

getTopHeadLinesByCategory(category: string, cargarMas: boolean = false): Observable<Article[]> {
  console.log("Peticion http realizada por categoria")
  return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}`, {
    params: { apiKey: apiKey, }
  }).pipe(
    map(({ articles }) => articles)
  );
}

Antiguo método de getArticulosPorCategoria:

return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}`, {
  params: { apiKey: apiKey, }
}).pipe(
  map(({ articles }) => articles)
);

Comentarios sobre la desestructuración en el map:
Aquí, como si ponemos el ratón encima de respuesta nos dice que es de tipo NewsResponse, y en la interfaz ya definimos que ese tipo
contiene "articles". Podemos en vez de poner map(respuesta => respuesta.articles)) 
poner map(({ articles }) => articles) 
Lo que hacemos es desestructurar los artículos de ese objeto directamente. Cualquiera vale.
*/