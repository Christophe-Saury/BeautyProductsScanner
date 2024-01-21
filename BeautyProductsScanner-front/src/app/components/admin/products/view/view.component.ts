import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductRequestEntity } from 'src/app/entities/product-request.entity';
import { AdminProductsService } from 'src/app/services/admin/products.service';
@Component({
  selector: 'app-admin-products-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class AdminProductsViewComponent {

  routerSub!: Subscription
  public id: number = 0

  productRequestEntity!: ProductRequestEntity

  isLoading = false

  constructor(public router:Router, public productsService: AdminProductsService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.routerSub = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.id = +(this.route.snapshot.paramMap.get('id') ?? 0);
        this.getProduct()
      }
    });

    this.id = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.getProduct()

  }

  getProduct(){
    this.productsService.getProductRequest(this.id).subscribe({
      next: (data)=>{
        if(data)
          this.productRequestEntity = data
      },
      error: (err)=>{

      }
    });
  }

  confirmProduct(state: number){
    this.productsService.configProductRequest(this.id, state).subscribe({
      next: (data)=>{
        if(data.success){
          this.productRequestEntity.state = state
        }
      },
      error: (err)=>{

      }
    });
  }

}
