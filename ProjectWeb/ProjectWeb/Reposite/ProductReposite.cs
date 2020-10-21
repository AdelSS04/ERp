using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Data;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Reposite
{
    public class ProductReposite : ProductInterface
    {
        private readonly ApplicationDbContext _applicationDbContext;
        public ProductReposite(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;

        }
        public async Task<IEnumerable<ProductModel>> GetAllProduct()
        {
            var result = await _applicationDbContext.Products.ToListAsync();
            return result;
        }

       
        public bool ProductExist(int id)
        {
           return _applicationDbContext.Products.Any(p => p.ProductID == id);
           
        }
        public async Task<ProductModel> GerProductById(int id)
        {
            return await _applicationDbContext.Products.FindAsync(id);

        }
        public async Task<EntityEntry<ProductModel>> AddProduct(ProductModel formdata)
        {
            var result = await _applicationDbContext.Products.AddAsync(formdata);
            try
            {
                await _applicationDbContext.SaveChangesAsync();
                return result;
            }
            catch (Exception)
            {

                return null; ;
            }
        }

        public void UpdateProduct(ProductModel formdata)
        {
           _applicationDbContext.Entry(formdata).State = EntityState.Modified;
           _applicationDbContext.SaveChanges();    
        }
        public void DeleteProduct(ProductModel formdata)
        {
            _applicationDbContext.Products.Remove(formdata);
            _applicationDbContext.SaveChanges();
        }

    }
}