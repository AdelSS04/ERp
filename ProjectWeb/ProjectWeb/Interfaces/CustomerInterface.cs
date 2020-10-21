using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Interfaces
{
   public interface CustomerInterface
    {
        Task<List<Customer>> GetCustomer();
        Task<EntityEntry<Customer>> AddCustomer(Customer formdata);
        void UpdateCustomer(Customer formdata);
        void DeleteCustomer(Customer formdata);
        Task<Customer> CustomerExist(int id);
    }
}
