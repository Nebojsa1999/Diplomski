import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  user:any;
  form: UntypedFormGroup;
  centerAccounts:any;
  displayedColumns: string[] = ['Name','Description', 'Address','City','Country'];
  public hideElement: boolean = false;

  toggleElement(){
     this.hideElement = true;
  }

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private api:ApiService) {
    
    this.form = this.fb.group({
      centerName: ['']
    });
 
  }

  async onSubmit(): Promise<void> {
    const centerName = this.form.get('centerName')?.value;  
    this.api.searchCenter({
      centerName: centerName

    }).subscribe((response : any) => {
      this.centerAccounts = response;
   
    })
  }
}
