import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'

export interface Post {
  id: string,
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
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  
  postCollectionRef: AngularFirestoreCollection<Post>;
  postCollectionList: Observable<Post[]>;
  routeData: any;
  activePerson: any;

  constructor(
    public authService: AuthService,
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.afs.firestore.settings({
      timestampsInSnapshots: true
    });
    let params = this.route.params;
    params.subscribe(d => {
      this.activePerson = d.name;
      this.postCollectionRef = this.afs.collection('posts', ref => ref.where('author', '==', d.name).orderBy('date', 'desc'));
      this.postCollectionList = this.postCollectionRef.valueChanges();
    });
    this.route.data.subscribe(routeData => {
      this.routeData = routeData['data'];
    });
  }

}
