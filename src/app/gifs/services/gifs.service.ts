import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Datum, SearchGifsResponse } from '../interfaces/gifs.interface'

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'TCErUdXQhJwuhBHBpwufqK7nJTWDglns'
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = []

  public resultados: Datum[] = []

  get historial() {
    return [...this._historial]
  }

  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('historial')) {
      this._historial = JSON.parse(sessionStorage.getItem('historial')!) || []
      this.resultados = JSON.parse(sessionStorage.getItem('response')!) || []
    }
  }

  buscarGifs(query: string = '') {
    query = query.trim().toLocaleLowerCase()
    if (query.length === 0) {
      return
    }

    if (!this._historial.includes(query)) {
      this._historial.unshift(query)
      this._historial.slice(0, 10)

      sessionStorage.setItem('historial', JSON.stringify(this._historial))
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', '20')
      .set('offset', '1')
      .set('rating', 'g')
      .set('lang', 'es')

    this.http
      .get<SearchGifsResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((res) => {
        this.resultados = res.data
        sessionStorage.setItem('response', JSON.stringify(res.data))
      })
  }
}
