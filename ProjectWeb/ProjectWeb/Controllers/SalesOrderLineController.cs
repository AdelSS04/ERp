using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;

namespace ProjectWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesOrderLineController : ControllerBase
    {
        private SalesOrderLineInterface _context;

        public SalesOrderLineController(SalesOrderLineInterface SalesOrderLineInterface)
        {
            _context = SalesOrderLineInterface;
        }

        [Route("{sales:int}")]
        [HttpGet]

        public async Task<IActionResult> GetAllSales(int sales)
        {
            return Ok(await _context.GetSalesOrderLine(sales));
        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireLoggedIn")]

        public async Task<IActionResult> DeleteSalesLine(int id)
        {
            SalesOrderLine SalesModel = await _context.GetSalesLineById(id);
            if (ModelState.IsValid)
            {

                if (SalesModel != null)
                {
                    _context.DeleteSalesLine(SalesModel);
                    return Ok(new JsonResult("The Product with id " + id + " is Deleted."));
                }
                return NotFound();
            }

            return BadRequest(ModelState);

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddSales(SalesOrderLine formdata)
        {

            if (ModelState.IsValid)
            {
                var result = await _context.AddSalesOrderLine(formdata);
                if (result != null)
                {
                    return Ok(new JsonResult("The Product was Added Successfully"));

                }
            }
            return BadRequest(new JsonResult("Bad Request !"));

        }
    }
}