using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProjectWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
       private readonly GalleryInterface _context;

        public GalleryController(GalleryInterface galleryreposite)
        {
            _context = galleryreposite;
        }
         [HttpGet("[action]")]
        public async Task<IActionResult> GetImageGallery() 
        {
            return Ok(await _context.GetAllGalleries());
        }

                // Return only Featured gallery
        [HttpGet("[action]/{galleryType}")]
        public IActionResult GetFeaturedImageGallery(string galleryType) 
        {
            if (!ModelState.IsValid)
             {
                 return BadRequest(ModelState);
             }
             var result = _context.GetFeaturedImageGallery(galleryType);
           
            return Ok(result);
        }

        [HttpGet("[action]/{galleryType}")]
        public IActionResult GetFeaturedGallery(string galleryType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = _context.GetFeaturedGallery(galleryType);

            return Ok(result);
        }
        // Get the Gallery by its Id
        [HttpGet("[action]/{id}")]
        public IActionResult GetImageGalleryById(int id) 
        {
             if (!ModelState.IsValid)
             {
                 return BadRequest(ModelState);
             }
             var result = _context.GetImageGalleryById(id);
              if (result == null)
              {
                  return NotFound();
              }     
              return Ok(result);       
                      
        }
     [HttpPost("[action]")]
        public async Task<IActionResult> CreateNewGallery(IFormCollection formdata) 
        { 
           /* Gallery gallery = new Gallery{GalleryType="adel",TimeCreated=DateTime.Now,LastUpdated=DateTime.Now,UserId="1",IsFeatured=true,IsActive=true

            
        };*/
          
          if ( await _context.CreateNewGallery(formdata))
            return new JsonResult("Successfully Added");
           else
           return new JsonResult("Failed !");

         
        }

        // Method To Delete the Gallery From Database and server
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteGallery(int id) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the gallery by its id - that you want to delete
            var findGallery = await _context.GetGalleryById(id);

            // If Result returned Null
             if (findGallery == null)
            {
                return NotFound();
            }

            // If Gallery With The Id Was Returned - Remove It from Database
            _context.Delete(findGallery);
            // Finally return success result to the client/browser
            return new JsonResult("Gallery Deleted : " + id);

        }

// Method to Update Gallery
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateGallery([FromRoute]int id, IFormCollection formData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
        try
        {
          await  _context.UpdateGallery( id,  formData);
            return new JsonResult("Updated Successfully : ");
        }
        catch (System.Exception)
        {
            return BadRequest();
            
        }
           

            

        }


        [HttpPut("[action]/{id}")]
        public async  Task<IActionResult> UpdateGalleryById([FromRoute]int id, IFormCollection formData)  
        {
            if (!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }

            // Will Hold the New Gallery Title
            string Title = formData["GalleryTitleEditById"];
   
            // Get the info of the Gallery that needs to be updated
            var AllGallery = await _context.GetAllGalleries();
        var  updateGallery=  AllGallery.FirstOrDefault(o => o.GalleryId == id);

            //await _db.Galleries.FirstOrDefaultAsync(o => o.GalleryId == id);

            // Will Hold the Is Active value
            if (formData["isActive"] == "on")
            {
                updateGallery.IsActive = true;
            }        
            else 
            {
                updateGallery.IsActive = false;
            }
            // Will Hold the Is Featured value
            if (formData["isfeatured"] == "on")
            {
                updateGallery.IsFeatured = true;
            }
            else 
            {
                updateGallery.IsFeatured = false;
            }

            // update the time stamps
            updateGallery.LastUpdated = DateTime.Now;
            updateGallery.Title = Title;
            // Update and Save Changes to the Database
           _context.Update(updateGallery);
            return new JsonResult("Updated Successfully : " + Title);


        }


    }
}
