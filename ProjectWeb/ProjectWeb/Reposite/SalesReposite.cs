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
    public class SalesReposite : SalesInterface
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public SalesReposite(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;

        }

        public async Task<List<Sales>> GetSales()
        {
            List<Sales> Items = await _applicationDbContext.Sales.ToListAsync();

            return Items;
        }
          public void DeleteSales(Sales formdata)
        {
            _applicationDbContext.Sales.Remove(formdata);
            _applicationDbContext.SaveChanges();
        }
           public async Task<Sales> GetSalesById(int id)
        {
            return await _applicationDbContext.Sales.FindAsync(id);

        }
        public async Task<EntityEntry<Sales>> AddSales(Sales formdata)
        {
            var result = await _applicationDbContext.Sales.AddAsync(formdata);
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
        public bool SalesExist(int id)
        {
            return _applicationDbContext.Sales.Any(p => p.SalesId == id);

        }
        public void UpdateSales(Sales formdata)
        {
            _applicationDbContext.Entry(formdata).State = EntityState.Modified;
            _applicationDbContext.SaveChanges();
        }
    }
}