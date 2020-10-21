using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Models
{
    public class DashboardModel
    {
        public double Money { get; set; }
        public int SalesCount { get; set; }
        public int ProductCount { get; set; }
        public int CustomerCount { get; set; }
    }
}
