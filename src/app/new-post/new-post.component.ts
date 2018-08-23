import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
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
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';
  postCollectionRef: AngularFirestoreCollection<Post>;
  postCollectionList: Observable<Post[]>;
  success = false;
  routeData: any;
  ref: any;
  uploadTask: any;
  uploadProgress: any;
  downloadURL: any;
  showProgressBar = false;
  showUploaded = false;

  constructor(
    public authService: AuthService,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  createForm() {
    this.loginForm = this.fb.group({
      id: ['', Validators.required],
      title: ['', Validators.required ],
      lede: ['', Validators.required ],
      body: ['', Validators.required ],
      date: ['', Validators.required ],
      category: ['', Validators.required ],
      author: ['', Validators.required ],
      imageURL: ['', Validators.required ],
      rating: ['', Validators.required ]
    });
  }

  upload(event) {
    this.showProgressBar = true;
    const randomId = Math.random().toString(36).substring(2);
    let filePath = "pic/" + randomId;
    this.ref = this.afStorage.ref(filePath)
    this.uploadTask = this.afStorage.upload(filePath, event.target.files[0]);
    this.uploadProgress = this.uploadTask.percentageChanges().subscribe(progress => {
     let ele = <HTMLElement>document.querySelector('#progressBar');
     ele.style.width = progress + "%";
      if(progress === 100){
        this.showProgressBar = false;
        this.showUploaded = true;
      }
    });
  }

  addPost(val) {
    this.ref.getDownloadURL().subscribe(ref => {
      this.downloadURL = ref;
    });
    if(val.title.trim().length === 0 || val.lede.trim().length === 0 || val.body.trim().length === 0 || val.category.trim().length === 0 || this.downloadURL === null || this.downloadURL === "") {
      this.errorMessage = "All fields are required."
    } else {
      let id = this.guidGenerator();
      let today = new Date();
      this.postCollectionRef.add({ id: id, title: val.title, lede: val.lede,  body: val.body, date: today, category: val.category, author: this.routeData.name, imageURL: this.downloadURL, rating: val.rating });
      this.success = true;
    }
  }

  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  selectCategory(val) {
    let buttons = document.querySelectorAll('.cat');
    let vm = this;
    [].forEach.call(buttons, function(btn) {
      if(btn.name === val){
        btn.classList.add("active");
        vm.loginForm.controls['category'].setValue(val);
      } else {
        btn.classList.remove("active");
      }
    });
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.router.navigate(['/post']);
    }, (error) => {
      console.log("Logout error", error);
    });
  }

  ngOnInit() {
    this.createForm();
    this.postCollectionRef = this.afs.collection('posts');
    this.postCollectionList = this.postCollectionRef.valueChanges();
    this.route.data.subscribe(routeData => {
      this.routeData = routeData['data'];
    });
  }

}
