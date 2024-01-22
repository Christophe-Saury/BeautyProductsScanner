import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Subscription } from 'rxjs';
import { CreateProductRequestEntity } from 'src/app/entities/product-request.entity';
import { ProductCommentEntity, ProductEntity } from 'src/app/entities/product.entity';
import { ApiProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';

require('dayjs/locale/fr')
dayjs.locale('fr')

@Component({
  selector: 'app-product-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ProductViewComponent {

  dayjs = dayjs

  routerSub!: Subscription
  public id: number = 0

  showModalGrade = false
  showModalEditProduct = false

  productEntity!: ProductEntity
  productRequestEntity: CreateProductRequestEntity = {
    name: "",
    brand: "",
    categories: "",
    code: "",
  }
  requestLoading = false
  requestSuccess = false

  isLoading = false

  comments: ProductCommentEntity[] = []
  newCommentText = ""
  commentLoading = false

  constructor(public router:Router, public userService: UserService, public productsService: ApiProductsService, private route: ActivatedRoute) { }

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
    this.requestSuccess = false
    this.isLoading = true
    this.productsService.getProduct({id: this.id}).subscribe({
      next: (data)=>{
        if(data.product){
          this.productEntity = data.product

          this.productRequestEntity = {
            name: this.productEntity.name,
            brand: this.productEntity.brand,
            categories: this.productEntity.categories,
            code: this.productEntity.code,
          }

          this.comments = data.comments
        }

        this.isLoading = false
         
      },
      error: (err)=>{
        this.isLoading = false
      }
    });
  }

  getCategories(){
    return this.productEntity.categories.split(";").map(c => c.split(">")[0]).concat(this.productEntity.categories.split(";").map(c => c.split(">")[1]))
  }

  setGrade(grade: number){
    this.productsService.setGrade(this.id, grade).subscribe({
      next: (data)=>{
        this.productEntity.grade = data.grade
        this.productEntity.countGrade = data.countGrade
        this.showModalGrade = false
      },
      error: (err)=>{

      }
    });
  }

  submitProductRequest(){
    this.requestLoading = true
    this.requestSuccess = false
    const finalRequest: CreateProductRequestEntity = {
      ...this.productEntity.name != this.productRequestEntity.name ? { name : this.productRequestEntity.name} : null,
      ...this.productEntity.brand != this.productRequestEntity.brand ? { brand : this.productRequestEntity.brand} : null,
      ...this.productEntity.code != this.productRequestEntity.code ? { code : this.productRequestEntity.code} : null,
      ...this.productEntity.categories != this.productRequestEntity.categories ? { categories : this.productRequestEntity.categories} : null
    }


    this.productsService.productRequest(this.id, finalRequest).subscribe({
      next: (data)=>{
        this.requestLoading = false
        this.requestSuccess = true
      },
      error: (err)=>{
        this.requestLoading = false
      }
    });
  }

  submitNewComment(){
    if(this.newCommentText=='')return;
    this.commentLoading = true

    this.productsService.createProductComment(this.id, this.newCommentText).subscribe({
      next: (data)=>{
        if(data.comment){
          this.comments.push(data.comment)

          this.comments.sort((a, b) => {
            return <any>b.id - <any>a.id;
          });
        }

        this.commentLoading = false
        this.newCommentText = ""
      },
      error: (err)=>{
        this.commentLoading = false
      }
    });
  }

  deleteComment(commentId: number){
    this.productsService.deleteProductComment(this.id, commentId).subscribe({
      next: (data)=>{
        if(data.success){
          this.comments = this.comments.filter(c => c.id != commentId)
        }
      },
      error: (err)=>{
      }
    });
  }

}
