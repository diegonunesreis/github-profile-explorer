import { GithubService } from './shared/services/github.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'github-profile-explorer';

  constructor() { }

  ngOnInit(): void {
    
  }


}
