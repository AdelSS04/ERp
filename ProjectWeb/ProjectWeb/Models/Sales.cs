using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Models
{
    public class Sales
    {
        public int SalesId { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public double Total { get; set; }
        public DateTime PaidDate { get; set; }
        public DateTime ShippedDate { get; set; }
        public DateTime LivredDate { get; set; }
        public string Statut { get; set; } = "Unpaid";
        public List<SalesOrderLine> SalesOrderLine { get; set; }
       public Sales()
        {
            SalesOrderLine = new List<SalesOrderLine>();
        }
    }
} 
