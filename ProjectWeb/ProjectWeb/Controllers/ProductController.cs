using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectWeb.Interfaces;
using ProjectWeb.Models; 

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProjectWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductInterface _context;
       
        public ProductController(ProductInterface accountReposite)
        {
            _context = accountReposite;
          
        }

        // GET: api/<ProductController>

        [HttpGet]
       // [Authorize(Policy = "RequireLoggedIn")]

        public async Task<IActionResult> GetAllProduct()
        {

            return Ok(await _context.GetAllProduct());

        }

        
        [HttpPost("[action]")]
        public async Task<IActionResult> AddProduct(ProductModel formdata)
        {                  

            if (ModelState.IsValid)
            {
                var result = await _context.AddProduct(formdata);
                if (result != null)
                {
                    return Ok(new JsonResult("The Product was Added Successfully"));

                }
            }
            return BadRequest();

        }

        [HttpPut("[action]")]
      //  [Authorize(Policy = "RequireLoggedIn")]

        public async Task<IActionResult> UpdateProduct(ProductModel formdata)
        {
            if (ModelState.IsValid)
            { if (_context.ProductExist(formdata.ProductID))

                {
                    _context.UpdateProduct(formdata);
                    return Ok(new JsonResult("The Product with id " + formdata.ProductID + " is updated"));

                }

                return NotFound();
            }
                return BadRequest(ModelState);
        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireLoggedIn")]

        public async Task<IActionResult> DeleteProduct(int id)
        {
            ProductModel productModel= await _context.GerProductById(id);
            if (ModelState.IsValid)
            {
            
                if (productModel!=null)
                {
                    _context.DeleteProduct(productModel);
                    return Ok(new JsonResult("The Product with id " + id + " is Deleted."));
                }
                return NotFound();
            }
           
                return BadRequest(ModelState);
          

        }

    }
}
