//He generado esto mediante : https://app.quicktype.io/

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

export interface Article {
    source: Source;
    author?: string;
    title: string;
    description?: string;
    url: string;
    urlToImage?: string;
    publishedAt: Date;
    content?: string;
}

export interface Source {
    id?: string;
    name: string;
}

/*
Ahora que tenemos una interfaz podemos importarla en nuestra tab1 y usarla alli diciendo que la respuesta es de tiepo NewsResponse

*/ 