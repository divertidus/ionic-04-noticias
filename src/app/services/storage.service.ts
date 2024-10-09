import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.init();
  }

  /* la barra baja es convención para indicar que es privado, pero se consigue realmente por el private nada mas.*/
  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    console.log("Ionic Storage inicializado: ", storage);

  }

  /* ESTO VIENE EN LA AYUDA PERO NO LO VAMOS A IMPLEMENTAR AHORA 

  
  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
    */

  async saveRemoveArticle(articuloRecibido: Article) {

    //Esto es: mi array de articulos será igual al articulo recibido +  los articulos que ya tenia.
    //Lo podría poner en orden inverso [...this._localArticles,articuloRecibido,] pero asi tengo "primero el nuevo".
    this._localArticles = [articuloRecibido, ...this._localArticles]

    //Uso mi storage para grabar ( set) una key que se llame articulos, y en ella guardo todo el array de articulos.
    //No necesito serializar ni convertir a String ni nada porque el Storage ya graba objetos
    this._storage?.set('articles', this._localArticles)

    console.log("Artículos guardados: ", this._localArticles);

  }

  async getLocalArticles() {
    if (!this._storage) {
      await this.init();
    }
    const savedArticles = await this._storage?.get('articles');
    this._localArticles = savedArticles || [];
    return this._localArticles;
  }

}

/* Probaremos esto primero ( v22) en el article.ts */


/*     --> SOLUCION AQUI !! 
https://forum.ionicframework.com/t/ionicstorage-for-angular-in-ionic-7/232596/5
*/

/*ENLACES CON LA AYUDA pero no funcionaron...:

https://ionicframework.com/docs/angular/storage

QUE LLEVA A:

https://github.com/ionic-team/ionic-storage
*/