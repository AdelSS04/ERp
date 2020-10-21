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
    public class SalesController : ControllerBase
    {
        private SalesInterface _context;

        public SalesController(SalesInterface SalesInterface)
        {
            _context = SalesInterface;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllSales()
        {
            return Ok(await _context.GetSales());
        }
        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireLoggedIn")]

        public async Task<IActionResult> DeleteSales(int id)
        {
            Sales SalesModel= await _context.GetSalesById(id);
            if (ModelState.IsValid)
            {
            
                if (SalesModel!=null)
                {
                    _context.DeleteSales(SalesModel);
                    return Ok(new JsonResult("The Product with id " + id + " is Deleted."));
                }
                return NotFound();
            }
           
                return BadRequest(ModelState);
          

        }
        [HttpPost("[action]")]
        public async Task<IActionResult> AddSales(Sales formdata)
        {

            if (ModelState.IsValid)
            {
                var result = await _context.AddSales(formdata);
                if (result != null)
                {
                    return Ok(new JsonResult("The Product was Added Successfully"));

                }
                
            }
            return BadRequest(new JsonResult("Bad Request !"));

        }
 
        [HttpPut("[action]")]
        [Authorize(Policy = "RequireLoggedIn")]
        public async Task<IActionResult> UpdateSalesId(Sales formdata)
        {
            if (ModelState.IsValid)
            {
                if (_context.SalesExist(formdata.SalesId))

                {
                    _context.UpdateSales(formdata);
                    return Ok(new JsonResult("The Product with id " + formdata.SalesId + " is updated"));

                }

                return NotFound();
            }
            return BadRequest(ModelState);
        }
    }
}