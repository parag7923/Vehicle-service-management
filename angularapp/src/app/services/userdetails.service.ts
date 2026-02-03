import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UserdetailsService {
  apiUrl=`${BASE_URL}/api/user`;

  constructor(private http:HttpClient) { }

  getAllUsers():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`);
  }

  deleteUser(userId:number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }

  getUserByName(name:string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${name}`);
  }

  updateUser(userId:number,user:User):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${userId}`,user);
  }
}
