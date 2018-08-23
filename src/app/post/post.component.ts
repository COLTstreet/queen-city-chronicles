import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

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
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {


  id:any;
  postCollectionRef: AngularFirestoreCollection<Post>;
  postCollectionList: Observable<Post[]>;
  allPostCollectionRef: AngularFirestoreCollection<Post>;
  allPostCollectionList: Observable<Post[]>;
  routeData: any;
  category: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) { 
  }

  ngOnInit() {
    this.afs.firestore.settings({
      timestampsInSnapshots: true
    });
    let params = this.route.params;
    params.subscribe(d => {
      this.postCollectionRef = this.afs.collection('posts', ref => ref.where('id', '==', d.id).orderBy('date', 'desc'));
      this.postCollectionList = this.postCollectionRef.valueChanges();
      this.allPostCollectionRef = this.afs.collection('posts', ref => ref.where('category', '==', d.category).orderBy('date', 'desc'));
      this.allPostCollectionList = this.allPostCollectionRef.valueChanges();
    });
    this.route.data.subscribe(routeData => {
      this.routeData = routeData['data'];
    });
  }

}
