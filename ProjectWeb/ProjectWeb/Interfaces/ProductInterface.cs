using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Interfaces
{ 
  public  interface ProductInterface
    {
        Task<IEnumerable<ProductModel>> GetAllProduct();
        bool ProductExist(int id);
        Task<ProductModel> GerProductById(int id);
        Task<EntityEntry<ProductModel>> AddProduct(ProductModel formdata);
        void UpdateProduct(ProductModel formdata);
        void DeleteProduct(ProductModel formdata);

    }
}
