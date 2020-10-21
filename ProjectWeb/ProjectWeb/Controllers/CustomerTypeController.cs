using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;

namespace ProjectWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerTypeController : ControllerBase
    {
        private CustomerTypeInterface _context;

        public CustomerTypeController(CustomerTypeInterface customerTypeInterface)
        {
            _context = customerTypeInterface;
        }

        // GET: api/<ProductController>

        [HttpGet]
        [Authorize(Policy = "RequireLoggedIn")]
        public async Task<IActionResult> GetAllCustomerTypet()
        {
            return Ok(await _context.GetCustomerType());
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddCustomerType(CustomerType formdata)
        {

            if (ModelState.IsValid)
            {
                var result = await _context.AddCustomerType(formdata);
                if (result != null)
                {
                    return Ok(new JsonResult("The Product was Added Successfully"));

                }
            }
            return BadRequest();

        }
        [HttpPut("[action]")]
        [Authorize(Policy = "RequireLoggedIn")]

        public async Task<IActionResult> UpdateCustomerType(CustomerType formdata)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _context.UpdateCustomerType(formdata);
                    return Ok(new JsonResult("The Product with id " + formdata.CustomerTypeId + " is updated"));
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

        public async Task<IActionResult> DeleteCustomerType(int id)
        {
            CustomerType productModel = await _context.CustomerTypeExist(id);
            if (ModelState.IsValid)
            {

                if (productModel != null)
                {
                    _context.DeleteCustomerType(productModel);
                    return Ok(new JsonResult("The Product with id " + id + " is Deleted."));
                }
                return NotFound();
            }

            return BadRequest(ModelState);


        }
    }
}
