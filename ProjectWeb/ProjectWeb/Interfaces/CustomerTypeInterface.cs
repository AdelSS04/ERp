using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Interfaces
{
   public interface CustomerTypeInterface
    {
        Task<List<CustomerType>> GetCustomerType();
        Task<EntityEntry<CustomerType>> AddCustomerType(CustomerType formdata);
        void UpdateCustomerType(CustomerType formdata);
        void DeleteCustomerType(CustomerType formdata);
        Task<CustomerType> CustomerTypeExist(int id);

    }
}
