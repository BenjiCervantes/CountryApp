import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'countries-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: [

  ]
})
export class ByCountryPageComponent implements OnInit {

  public initialValue: string = '';
  public isLoading: boolean = false;
  public countries: Country[] = [];

  constructor ( private countriesService: CountriesService ) { }

  ngOnInit(): void {
    this.countries =  this.countriesService.cacheStore.byCountries.countries;
    this.initialValue = this.countriesService.cacheStore.byCountries.term;
  }

  searchByCountry( term: string ) {
    this.isLoading = true;
    this.countriesService.searchCountry(term)
      .subscribe( country => {
        this.countries = country;
        this.isLoading = false;
      });
  }
}
