import { Component } from '@angular/core';
import { Observable, Subject, Subscription, interval } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Router } from '@angular/router';
import { ApiProductsService } from 'src/app/services/products.service';
import { ProductEntity } from 'src/app/entities/product.entity';

/// <reference types="web-barcode-detector" />

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent {

  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  sysImage = '';

  imageUrl: string | undefined = ''
  codeData = ''

  scanning = false
  scanSub!: Subscription

  scannedProduct: ProductEntity | undefined

  showModalFindArticle = false;
  showModalUnableFindArticle = false

  constructor(public router:Router, public productsService: ApiProductsService,) { }


  ngOnInit() {
    // this.searchProduct("669312011557a")
    this.startScan()
    
  }

  ngOnDestroy(){
    this.scanSub?.unsubscribe()
  }
  
  public getSnapshot(): void {
    this.trigger.next(void 0);
  }

  public captureImg(webcamImage: WebcamImage): void {

    this.imageUrl = undefined

    setTimeout(()=>{
      this.webcamImage = webcamImage;
      this.sysImage = webcamImage!.imageAsDataUrl; 
      this.imageUrl = webcamImage.imageAsDataUrl
    }, 10)
  }

  scan(){
    this.getSnapshot()
  }

  startScan(){
    this.scanning = true
    this.scanSub = interval(3000).subscribe((val) => this.scan());
  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  codeOutput(event: any){
    this.codeData = event[0].value
    this.searchProduct(this.codeData)
  }

  searchProduct(barcode: string){
    this.productsService.getProduct({code: barcode}).subscribe({
      next: (data)=>{
          if(data.product){
            this.scannedProduct = data.product
            this.showModalFindArticle = true
          } else {
            this.scannedProduct = undefined
            this.showModalUnableFindArticle = true
          }
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

}
