using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Data;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;

namespace ProjectWeb.Reposite {
    public class SalesOrderLineReposite : SalesOrderLineInterface {
        private readonly ApplicationDbContext _applicationDbContext;

        public SalesOrderLineReposite (ApplicationDbContext applicationDbContext) {
            _applicationDbContext = applicationDbContext;

        }
        public bool SalesLineExist (int id) {
            return _applicationDbContext.SalesOrderLine.Any (p => p.SalesOrderLineId == id);

        }
        public async Task<SalesOrderLine> GetSalesLineById(int id)
        {
            return await _applicationDbContext.SalesOrderLine.FindAsync(id);

        }
        public void DeleteSalesLine (SalesOrderLine formdata) {
            _applicationDbContext.SalesOrderLine.Remove (formdata);
            _applicationDbContext.SaveChanges ();
        }
        public async Task<Object> GetSalesOrderLine (int sales) {
            var Items = _applicationDbContext.SalesOrderLine.Where (q => q.Sales.SalesId == sales);

            return Items;
        }
        public async Task<EntityEntry<SalesOrderLine>> AddSalesOrderLine (SalesOrderLine formdata) {
            var result = await _applicationDbContext.SalesOrderLine.AddAsync (formdata);
            try {
                await _applicationDbContext.SaveChangesAsync ();
                return result;
            } catch (Exception) {

                return null;;
            }
        }
    }
}