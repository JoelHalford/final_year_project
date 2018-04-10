import { Pipe, PipeTransform } from '@angular/core'; //imports Pipe/PipeTransform from angular

@Pipe(
{//name of filter = 'filter'
  name: 'filter'
})

export class FilterPipe implements PipeTransform 
{//filter to return products with each key press
  transform(products: any, term: any): any 
  {
    if(term === undefined)
    {//check if search term is undefined
    	return products;
    }

    return products.filter(function(product)
    {//return updated products array

    	//checks product_name, product_location and createdBy
    	//each set to lowercase to prevent case-sensivity	
    	return product.product_name.toLowerCase().includes(term.toLowerCase()) 
    	|| product.product_location.toLowerCase().includes(term.toLowerCase())  
    	|| product.createdBy.toLowerCase().includes(term.toLowerCase());
    })
  }
}