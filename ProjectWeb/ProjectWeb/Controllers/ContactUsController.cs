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
    public class ContactUsController : ControllerBase

    {
        private ContactUsInterface _context;

        public ContactUsController(ContactUsInterface ContactUs)
        {
            _context = ContactUs;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddContactUs(ContactUs formdata)
        {

            if (ModelState.IsValid)
            {
                var result = await _context.AddMessage(formdata);
                if (result != null)
                {
                    return Ok(new JsonResult("The Product was Added Successfully"));

                }
            }
            return BadRequest(new JsonResult("Bad Request !"));

        }
    }
}
