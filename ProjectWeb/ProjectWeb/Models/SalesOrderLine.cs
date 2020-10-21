using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Models
{
    public class SalesOrderLine
    {
        public int SalesOrderLineId { get; set; }
        public double Quantity { get; set; }
        public double Price { get; set; }
        public double Total { get; set; }
        public Sales Sales { get; set; }
        public int SalesId { get; set; }
        public int test { get; set; }

        public ProductModel ProductModel { get; set; }
        public int ProductModelId { get; set; }
    }
} 
