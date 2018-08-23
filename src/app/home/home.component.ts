import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'
import { DataService } from '../core/data.service';
import * as $ from 'jquery';

export interface Post {
  id:string,
  title: string,
  lede: string,
  body: string,
  date: Date,
  category: string,
  author: string,
  imageURL: string,
  rating: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';
  postCollectionRef: AngularFirestoreCollection<Post>;
  postCollectionList: Observable<Post[]>;
  postCollectionArray;
  featuredPost: any;
  show = false;
  message:string;
  showFilters = false;

  constructor(
    public authService: AuthService,
    private afs: AngularFirestore,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.afs.firestore.settings({ timestampsInSnapshots: true });

    this.postCollectionRef = this.afs.collection('posts', ref => ref.orderBy('date', 'desc'));
    this.postCollectionList = this.postCollectionRef.valueChanges();
    this.postCollectionList.subscribe(data => {
      this.postCollectionArray = data.slice();
      this.featuredPost = data[0];
      this.postCollectionArray.splice(0, 1);
      this.show = true;
    });
  }

  toggleCollapse() {
    document.getElementById('collapseExample').classList.toggle('hidden');
  }

  filter(filterVal, val) {
    if(val === "All"){
      this.postCollectionRef = this.afs.collection('posts', ref => ref.orderBy('date', 'desc'));
      this.postCollectionList = this.postCollectionRef.valueChanges();
      this.postCollectionList.subscribe(data => {
        this.postCollectionArray = data.slice();
        this.featuredPost = data[0];
        this.postCollectionArray.splice(0, 1);
      })
    } else {
      this.postCollectionRef = this.afs.collection('posts', ref => ref.where(filterVal, '==', val).orderBy('date', 'desc'));
      this.postCollectionList = this.postCollectionRef.valueChanges();
      this.postCollectionList.subscribe(data => {
        this.postCollectionArray = data.slice();
        this.featuredPost = data[0];
        this.postCollectionArray.splice(0, 1);
      })
    }
  }

}
