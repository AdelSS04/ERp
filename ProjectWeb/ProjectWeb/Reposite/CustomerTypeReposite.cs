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
    public class CustomerTypeReposite : CustomerTypeInterface
    {
        private ApplicationDbContext _applicationDbContext;

        public CustomerTypeReposite(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;

        }
        public async Task<List<CustomerType>> GetCustomerType()
        {
            List<CustomerType> Items = await _applicationDbContext.CustomerType.ToListAsync();

            return Items;
        }

        public async Task<EntityEntry<CustomerType>> AddCustomerType(CustomerType formdata)
        {
            var result = await _applicationDbContext.CustomerType.AddAsync(formdata);
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

        public void UpdateCustomerType(CustomerType formdata)
        {
            _applicationDbContext.Entry(formdata).State = EntityState.Modified;
            _applicationDbContext.SaveChanges();
        }
        public async Task<CustomerType> CustomerTypeExist(int id)
        {
            return  await _applicationDbContext.CustomerType.FindAsync(id);
        }

            public void DeleteCustomerType(CustomerType formdata)
        {
            _applicationDbContext.CustomerType.Remove(formdata);
            _applicationDbContext.SaveChanges();
        }
    }
}
