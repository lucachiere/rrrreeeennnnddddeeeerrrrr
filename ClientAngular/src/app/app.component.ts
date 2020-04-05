import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Unit } from './unit.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  obsUnit: Observable<Unit[]>; //L’observable che sta in attesa dei dati
  data: Unit[];
  postObserver : Observable<Object>;
  postData : Object;
    Unit : string;
    Cost : string;
    Hit_Speed: string;
    Deploy_Time: string;
    Range: string;
    Target: string;
    Count: string;
    Transport: string;
    Type: string;
    Rarity: string;

  constructor(private http: HttpClient) { } //Dependency injection
  getUnitList(): void {
    //Qui va sostituito l’url con quello delle vostre api
    this.obsUnit = this.http.get<Unit[]>('https://3000-deb55d05-3b18-4466-a225-a908cab72923.ws-eu01.gitpod.io/users/json');
    //Mi sottoscrivo all’observable e scrivo la arrow function che riceve i dati
    this.obsUnit.subscribe((data: Unit[]) => {this.data = data;});
  }

addUnit(newUnit: HTMLInputElement, newCost: HTMLInputElement, newHitSpeed: HTMLInputElement, newDeployTime: HTMLInputElement,
   newRange: HTMLInputElement, newTarget: HTMLInputElement, newCount: HTMLInputElement, newTransport: HTMLInputElement,
   newType: HTMLInputElement, newRarity: HTMLInputElement): boolean {
    let newData: Unit = new Unit(this.Unit,this.Cost,this.Hit_Speed,this.Deploy_Time,this.Range,this.Target,this.Count,this.Transport,this.Type,this.Rarity);
    newData.Unit = newUnit.value;
    newData.Cost = newCost.value;
    newData.Hit_Speed = newHitSpeed.value;
    newData.Deploy_Time = newDeployTime.value;
    newData.Range = newRange.value;
    newData.Target = newTarget.value;
    newData.Count = newCount.value;
    newData.Transport = newTransport.value;
    newData.Type = newType.value;
    newData.Rarity = newRarity.value;
    let headers =  {headers: new HttpHeaders().set('Content-Type', 'application/json')};
    this.postObserver = this.http.post('https://3000-deb55d05-3b18-4466-a225-a908cab72923.ws-eu01.gitpod.io/users/', JSON.stringify(newData),headers)

    //Meglio così ma da verificare
    //this.postObserver = this.http.post('http://localhost:3000/users', newData);
    this.postObserver.subscribe(data => this.postData = data);
    return false;
  }

}
