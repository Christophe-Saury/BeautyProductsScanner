import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FullCategorie, ProductEntity, SubCategorie } from 'src/app/entities/product.entity';
import { ApiProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  searchText = ""
  searchProducts: ProductEntity[] = []

  productsMostLiked: ProductEntity[] = []
  productsMostCommented: ProductEntity[] = []

  categories: FullCategorie[] = []

  isLoading = false

  currentPage = 1;
  totalCount = 0;
  totalPages = 0;

  constructor(private productsService: ApiProductsService, public router:Router) { }

  ngOnInit(){
    // this.search()
    // this.getCategories()

    this.loadHomeData()
  }

  loadHomeData(){
    this.isLoading = true
    this.productsService.getHomeData().subscribe({
      next: (data)=>{
        this.isLoading = false
        this.productsMostLiked = data.mostLiked
        this.productsMostCommented = data.mostCommented
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

  isHome(){
    return this.searchText == '' || this.searchProducts.length == 0
  }

  search(){
    if(this.searchText == '' && this.getSelectedCategories().length == 0) return
    this.isLoading = true;

    const filter = {
      ...this.searchText != "" ? { text: this.searchText} : null,
      ...this.getSelectedCategories().length > 0 ? { categories: this.getSelectedCategories().map(c => c.fullName).join(';')} : null
    }

    this.productsService.search(filter, this.currentPage).subscribe({
      next: (data)=>{
        this.searchProducts = data.products
        this.totalPages = data.totalPages
        this.totalCount = data.totalCount

        this.isLoading = false

        // if(this.categories.length == 0){
        //   this.categories = []

        //   data.forEach(p => {
        //     p.categories.split(";").forEach(c => {
  
        //       const catName = c.split(">")[0]
        //       const subCar = c.split(">")[1]
  
        //       if(this.categories.find(f => f.mainCategory == catName)){
        //         if(!this.categories.find(f => f.mainCategory == catName)?.subCategories.find(f => f.name == subCar))
        //           this.categories.find(f => f.mainCategory == catName)?.subCategories.push({name: subCar, fullName: c, selected: false})
        //       } else {
        //         this.categories.push({
        //           mainCategory: catName,
        //           subCategories: subCar ? [{name: subCar, fullName: c, selected: false}] : [],
        //         })
        //       }
        //     })
        //   })
        // }
     
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

  getCategories(){
    this.productsService.getCategories().subscribe({
      next: (data)=>{
        console.log(data.length)
        this.categories = data
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

  selectCat(category: FullCategorie, subCategory: SubCategorie){
    subCategory.selected = !subCategory.selected
  }

  getSelectedCategories() : SubCategorie[]{
    let subCategories: SubCategorie[] = []
    this.categories.forEach(c => c.subCategories.filter(s => s.selected).forEach(s => subCategories.push(s)))
    return subCategories
  }

  onPageChange(page: number){
    this.currentPage = page
    this.search()
  }

}
