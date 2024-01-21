import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { ProductRequestEntity } from 'src/app/entities/product-request.entity';
import { AdminProductsService } from 'src/app/services/admin/products.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class AdminProductsComponent {

  dayjs = dayjs

  isLoading = false

  products: ProductRequestEntity[] = []
  totalCount = 0
  totalPages: number = 1
  currentPage = 1;

  constructor(private adminProductsService: AdminProductsService, public router:Router) { }

  ngOnInit(){
    this.search()
  }

  search(){
    this.isLoading = true;

    this.adminProductsService.getProductRequests(this.currentPage).subscribe({
      next: (data)=>{
        this.isLoading = false
        
        this.products = data.products
        this.totalPages = data.totalPages
        this.totalCount = data.totalCount
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

  onPageChange(page: number){
    this.currentPage = page
    this.search()
  }
  
}
