using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;

namespace ProjectWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly SalesInterface _context;

        public DashboardController(SalesInterface customerInterface)
        {
            _context = customerInterface;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashModel()
        {
            DashboardModel dashboardModel= new DashboardModel();
            var ListSales = _context.GetSales();
            dashboardModel.SalesCount = ListSales.Result.Count;
            dashboardModel.Money = ListSales.Result.Sum(t => t.Total);
            return Ok(dashboardModel);

        }
    }
}
