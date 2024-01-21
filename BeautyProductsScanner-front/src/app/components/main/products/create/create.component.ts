import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateProductRequestEntity } from 'src/app/entities/product-request.entity';
import { ProductEntity } from 'src/app/entities/product.entity';
import { ApiProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateProductComponent {

  productCreateEntity: CreateProductRequestEntity = {}
  isLoading = false
  isSuccess = false

  constructor(public productsService: ApiProductsService, private route: ActivatedRoute) { }

  ngOnInit(){
    this.route.queryParams
    .subscribe(params => {
      this.productCreateEntity.code = params['code']
    }
  );
  }

  submitRequest(){
    this.isLoading = true
    this.isSuccess = false

    this.productsService.createProductRequest(this.productCreateEntity).subscribe({
      next: (data)=>{
        this.isLoading = false
        this.isSuccess = true
      },
      error: (err)=>{
        this.isLoading = false
        this.isSuccess = false
      }
    });

  }

}
