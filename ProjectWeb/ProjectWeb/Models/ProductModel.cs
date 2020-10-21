using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Models
{
    public class ProductModel
    {
       [Key]
        public int ProductID { get; set; }
        [Required]
        [MaxLength(50)]
        public string ProductName { get; set; }
        [Required]
        [MaxLength(150)]
        public string ProductDesc { get; set; }
        [Required]
        public bool OutOfStock { get; set; }
        [Required]
        public string ImageUrl { get; set; }
        [Required]
        public double ProductPrice { get; set; }
        public List<SalesOrderLine> SalesOrderLine { get; set; }
              public ProductModel()
        {
            SalesOrderLine = new List<SalesOrderLine>();
        }

    }
}
