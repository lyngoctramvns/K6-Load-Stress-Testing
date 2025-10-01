import http, { Response } from 'k6/http';
import { check } from 'k6';
import { searchProductParam } from '../payload';

export class ProductComponent {
    public url: string;
    public headers: any;
    constructor(url: string, headers: any){
        this.url = url;
        this.headers = headers;
    }

    allProducts(){
        // GET all product request
        const res: Response = http.get(`${this.url}api/productsList`);
        check(res, {
            'status is 200': (r: Response) => r.status === 200,
        });
        // POST All Products request
        const postAllProductRes: Response = http.post(
            `${this.url}api/productsList`,
            "",
            this.headers
        );
        const postAllProductResTrue = check(postAllProductRes, {
            'status is 405': (r: Response) => r.status === 405,
        })
        if(!postAllProductResTrue){
            console.log(`POST All Products request FAILED: ${postAllProductRes.body}`);
        }
    }

    allBrands(){
    //GET all brand list
      const allBrandListRes: Response = http.get(
        `${this.url}api/brandsList`
      )
      const allBrandListResTrue = check(allBrandListRes, {
        'status is 200': (r: Response) => r.status === 200,
      })
      if(!allBrandListResTrue){
        console.log(`GET all brand list request FAILED: ${allBrandListRes.body}`);
      }
    //PUT to all brand list
      const allBrandListPutRes: Response = http.put(
        `${this.url}api/brandsList`
      )
      const allBrandPutResTrue = check(allBrandListPutRes, {
        'Status is 405': (r: Response) => r.status === 405,
      })
      if(!allBrandPutResTrue){
        console.log(`PUT to all brand list request FAILED: ${allBrandListPutRes.body}`);
      }
    }

    searchProducts(){
      // POST Search Product request
      const formSearchProductData = JSON.stringify(searchProductParam())
      const searchProductRes: Response = http.post(
        `${this.url}api/searchProduct`,
        formSearchProductData,
        this.headers
      )
      const searchProductResTrue = check(searchProductRes, {
        'status is 200': (r: Response) =>r.status === 200
      });
      if(!searchProductResTrue){
        console.log(`POST Search Product request FAILED: ${searchProductRes.body}`);
      }
    }
}