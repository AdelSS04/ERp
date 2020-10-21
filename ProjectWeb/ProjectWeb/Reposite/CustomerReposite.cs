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
    public class CustomerReposite : CustomerInterface
    {
        private ApplicationDbContext _applicationDbContext;

        public CustomerReposite(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<List<Customer>> GetCustomer()
        {
            List<Customer> Items = await _applicationDbContext.Customer.ToListAsync();

            return Items;
        }

        public async Task<EntityEntry<Customer>> AddCustomer(Customer formdata)
        {
            var result = await _applicationDbContext.Customer.AddAsync(formdata);
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

        public void UpdateCustomer(Customer formdata)
        {
            _applicationDbContext.Entry(formdata).State = EntityState.Modified;
            _applicationDbContext.SaveChanges();
        }
        public async Task<Customer> CustomerExist(int id)
        {
            return await _applicationDbContext.Customer.FindAsync(id);
        }

        public void DeleteCustomer(Customer formdata)
        {
            _applicationDbContext.Customer.Remove(formdata);
            _applicationDbContext.SaveChanges();
        }
    }
}
