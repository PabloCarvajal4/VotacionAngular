import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Votacion, VotacionWithoutID } from '../models/votacion';
import { environment } from 'src/environments/environment';

const API= environment.urlBackend;
const ENDPOINT = 'votacions';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {

  constructor( 
    private http: HttpClient
    ) { }
//GET
getAllVotacion(){
  return this.http.get<Votacion[]>(`${API}/${ENDPOINT}`)
}

//POST
postVotacion(votacion:VotacionWithoutID){
  return this.http.post(`${API}/${ENDPOINT}`,votacion);
}

//PUT
putVotacion(id:string,votacion:VotacionWithoutID){
  return this.http.put(`${API}/${ENDPOINT}/${id}`,votacion)
}

//PATCH
patchVotacion(id:string,votacion:VotacionWithoutID){
  return this.http.patch(`${API}/${ENDPOINT}/${id}`,votacion)
}

//DELETE
deleteVotacion(id:string){
  return this.http.delete(`${API}/${ENDPOINT}/${id}`)
}
}

