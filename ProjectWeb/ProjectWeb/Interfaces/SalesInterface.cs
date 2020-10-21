using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Interfaces 
{
    public interface SalesInterface
    {
        Task<List<Sales>> GetSales();
        Task<Sales> GetSalesById(int id);
        Task<EntityEntry<Sales>> AddSales(Sales formdata);
        void UpdateSales(Sales formdata);
        bool SalesExist(int id);
        void DeleteSales(Sales formdata);



    }
}