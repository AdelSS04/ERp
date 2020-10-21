using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Models;
namespace ProjectWeb.Interfaces {
    public interface SalesOrderLineInterface {
        Task<Object> GetSalesOrderLine (int sales);
        Task<EntityEntry<SalesOrderLine>> AddSalesOrderLine (SalesOrderLine formdata);
        bool SalesLineExist (int id);
        Task<SalesOrderLine> GetSalesLineById(int id);

        void DeleteSalesLine (SalesOrderLine formdata);
    }
}