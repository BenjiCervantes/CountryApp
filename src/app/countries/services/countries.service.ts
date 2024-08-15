import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  public cacheStore: CacheStore = {
    byCapital:   { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion:    { region: '', countries: [] }
  }

  private apiUrl: string = 'https://restcountries.com/v3.1';

  constructor( private http: HttpClient ) {
    this.LoadFromLocalStorage();
   }

  private saveToLocalStorage(){
    localStorage.setItem( 'cacheStore', JSON.stringify( this.cacheStore ) );
  }

  private LoadFromLocalStorage(){

    if( !localStorage.getItem( 'cacheStore' ) ) return;
    this.cacheStore = JSON.parse( localStorage.getItem( 'cacheStore')! );
  }

  searchCountryByAlphaCode( code: string ): Observable<Country | null> {
    const url = `${ this.apiUrl }/alpha/${ code }`;
    return this.http.get<Country[]>( url )
    .pipe(
      map( countries => countries.length > 0 ? countries[0] : null),
      catchError( () => of (null))
    );
  }

  searchCapital( term: string ): Observable<Country[]> {
    const url = `${ this.apiUrl }/capital/${ term }`;
    return this.callHttpList( url )
      .pipe(
        tap( countries => this.cacheStore.byCapital = { term, countries } ),
        tap( () => this.saveToLocalStorage() )
      );
  }

  searchCountry( term: string): Observable<Country[]> {
    const url =  `${ this.apiUrl }/name/${ term }`;
    return this.callHttpList( url )
      .pipe(
        tap( countries => this.cacheStore.byCountries = { term, countries } ),
        tap( () => this.saveToLocalStorage() )
      );
  }

  searchRegion( term: Region ): Observable<Country[]> {
    const url = `${ this.apiUrl }/region/${ term }`;
    return this.callHttpList( url )
      .pipe(
        tap( countries => this.cacheStore.byRegion = { region: term, countries  } ),
        tap( () => this.saveToLocalStorage() )
      );
  }

  private callHttpList( url: string): Observable<Country[]> {
    return this.http.get<Country[]>( url )
    .pipe(
      catchError( () => of ([])),
      delay( 700 )
    );
  }

}
