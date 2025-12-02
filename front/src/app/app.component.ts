import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    user: any


  constructor(private router: Router) {

    router.events.subscribe((val) => {
      const userJSON = localStorage.getItem('user')

      if(userJSON) {
        this.user = JSON.parse(userJSON == null ? "" : userJSON);
      }
    });
  }


  ngOnInit(): void {

  }

  logout() {
    this.user = null;
    localStorage.clear();

    this.router.navigate(['/login']);
  }
}
