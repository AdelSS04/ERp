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
    public class CustomerController : ControllerBase
    {
        private CustomerInterface _context;

        public CustomerController(CustomerInterface customerInterface)
        {
            _context = customerInterface;
        }
        // GET: api/<ProductController>

        [HttpGet]
      //  [Authorize(Policy = "RequireLoggedIn")]
        public async Task<IActionResult> GetAllCustomert()
        {
            return Ok(await _context.GetCustomer());
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddCustomer(Customer formdata)
        {

            if (ModelState.IsValid)
            {
                var result = await _context.AddCustomer(formdata);
                if (result != null)
                {
                    return Ok(new JsonResult("The Product was Added Successfully"));

                }
            }
            return BadRequest(new JsonResult("Bad Request !"));

        }
        [HttpPut("[action]")]
        [Authorize(Policy = "RequireLoggedIn")]

        public async Task<IActionResult> UpdateCustomer(Customer formdata)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _context.UpdateCustomer(formdata);
                    return Ok(new JsonResult("The Product with id " + formdata.CustomerId + " is updated"));
                }
                catch (Exception)
                {

                    return NotFound();
                }


            }
            return BadRequest(ModelState);
        }
        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireLoggedIn")]

        public async Task<IActionResult> DeleteCustomer(int id)
        {
            Customer productModel = await _context.CustomerExist(id);
            if (ModelState.IsValid)
            {

                if (productModel != null)
                {
                    _context.DeleteCustomer(productModel);
                    return Ok(new JsonResult("The Product with id " + id + " is Deleted."));
                }
                return NotFound();
            }

            return BadRequest(ModelState);


        }
    }
}
