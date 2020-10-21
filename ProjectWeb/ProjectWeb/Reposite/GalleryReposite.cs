using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Data;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace ProjectWeb.Reposite
{
    public class GalleryReposite : GalleryInterface
    { private readonly ApplicationDbContext _db;
                  private readonly IHostingEnvironment _env;


     public GalleryReposite(ApplicationDbContext db, IHostingEnvironment env)
        {
            _db = db;
                      _env = env;

        }
  public async Task<IEnumerable<Gallery>> GetAllGalleries()
        {
            var result = await _db.Galleries.ToListAsync();
            return result;
        }

        public Object GetFeaturedImageGallery(string galleryType)
        {
            
             var result = from g in _db.Galleries.Where(g => g.IsFeatured == true && g.GalleryType == galleryType && g.IsActive == true)
                          join i in _db.GalleryImages on g.GalleryId equals i.GalleryId  
                          select new 
                          {
                             Gallery_Id = g.GalleryId,
                             Gallery_Title = g.Title,
                             Galelry_Path = g.GalleryUrl,
                             Gallery_Username = g.Username,
                             Gallery_Type = g.GalleryType,
                             Image_Id = i.ImageId,
                             Image_Path = i.ImageUrl,
                             Image_Caption = i.Caption,
                             Image_Description = i.Description,
                             Image_AltText = i.AlternateText   
                          };
                          return result;
        }

        public Object GetFeaturedGallery(string galleryType)
        {

            var result = from g in _db.Galleries.Where(g => g.IsFeatured == true && g.GalleryType == galleryType && g.IsActive == true)
                         join i in _db.GalleryImages on g.GalleryId equals i.GalleryId
                         select new
                         {
                             Gallery_Id = g.GalleryId,
                             Gallery_Title = g.Title,
                             Galelry_Path = g.GalleryUrl,
                             Gallery_Username = g.Username,
                             Gallery_Type = g.GalleryType,
                             Image_Id = i.ImageId,
                             Image_Path = i.ImageUrl,
                             Image_Caption = i.Caption,
                             Image_Description = i.Description,
                             Image_AltText = i.AlternateText

                         };
            return result;
        }

        public Object GetImageGalleryById(int id)
        {
            
             var result = from g in _db.Galleries
                          join i in _db.GalleryImages.Where(t => t.GalleryId == id)
                          on g.GalleryId equals i.GalleryId
                          select new 
                          {
                             Gallery_Id = g.GalleryId,
                             Gallery_Title = g.Title,
                             Galelry_Path = g.GalleryUrl,
                             Image_Id = i.ImageId,
                             Image_Path = i.ImageUrl,
                             Image_Caption = i.Caption,
                             Image_Description = i.Description,
                             Image_AltText = i.AlternateText
                          };  
                          return result;
        }

        public async Task<Boolean> CreateNewGallery(IFormCollection formdata) 
        {
try
{
    Gallery gallery = new Gallery{
        GalleryType=formdata["GalleryType"],
        Title = formdata["GalleryTitle"]
        };
    int i = 0;
            string GalleryTitle = formdata["GalleryTitle"];
            string GalleryType = formdata["GalleryType"]; 
            string Username = "Administrator";         
            DateTime LastUpdateTime = DateTime.Now;
             // First we will Create a new Gallery and get the Id of that gallery 
             int id = await CreateGalleryID(gallery);
            
            // Create the Gallery Path
            string GalleryPath = Path.Combine(_env.WebRootPath + $"{Path.DirectorySeparatorChar}uploads{Path.DirectorySeparatorChar}Gallery{Path.DirectorySeparatorChar}", id.ToString());
            // Path of gallery that will be stored in datatbase - No need to add full path
            string dbImageGalleryPath = Path.Combine($"{Path.DirectorySeparatorChar}uploads{Path.DirectorySeparatorChar}Gallery{Path.DirectorySeparatorChar}", id.ToString());
            // Create the Directory/Folder on Server to Store new Gallery Images
              CreateDirectory(GalleryPath);
           // Get all the files and file-details that were uploaded
            foreach (var file in formdata.Files)
            {
                if (file.Length > 0)
                {
                    // Set the extension, file name and path of the folder and file
                    var extension = Path.GetExtension(file.FileName);
                    // make the file name unique by adding date time Stamp
                    var filename = DateTime.Now.ToString("yymmssfff");
                    // Create the file path 
                    var path = Path.Combine(GalleryPath, filename) + extension;
                    // Path of Image that will be stored in datatbase - No need to add full path
                    var dbImagePath = Path.Combine(dbImageGalleryPath + $"{Path.DirectorySeparatorChar}", filename) + extension;
                    string ImageCaption = formdata["ImageCaption[]"][i];
                    string Description = formdata["ImageDescription[]"][i];
                    string AlternateText = formdata["ImageAlt[]"][i]; 
                     // Create the Image Model Object and assin values to its properties
                    GalleryImage Image = new GalleryImage();
                    Image.GalleryId = id;
                    Image.ImageUrl = dbImagePath;
                    Image.Caption = ImageCaption;
                    Image.Description = Description;
                    Image.AlternateText = AlternateText;
                    // Add Images detail to Images Table
                    await _db.GalleryImages.AddAsync(Image);
                    // Copy the uploaded images to Server - Uploads folder
                    // Using - Once file is copied then we will close the stream.
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    i = i + 1;
                }
            }
            
            gallery.LastUpdated = LastUpdateTime;
            gallery.Title = GalleryTitle; 
            gallery.GalleryType = GalleryType;
            gallery.Username = Username;           
            gallery.GalleryUrl = dbImageGalleryPath;      
            _db.Galleries.Update(gallery);
            await _db.SaveChangesAsync();
            return true ;
            }
              catch (System.Exception)
               {
    
                        return false ;
}
            
        }


          private async Task<int> CreateGalleryID(Gallery gallery)
        {
            DateTime CreateTime = DateTime.Now;
            gallery.TimeCreated = CreateTime;
            _db.Galleries.Add(gallery);
            await _db.SaveChangesAsync();
            await _db.Entry(gallery).GetDatabaseValuesAsync();
            int id = gallery.GalleryId;
            return id;
        }
             // Create the gallery Path if it does not exist
        private void CreateDirectory(string gallerypath)
        {
            if (!Directory.Exists(gallerypath))
            {
                Directory.CreateDirectory(gallerypath);
            }
        }
   public async Task<Gallery> GetGalleryById(int id)
        {
            return await _db.Galleries.FindAsync(id);

        }
         public void Delete(Gallery gallery)
        {
            _db.Galleries.Remove(gallery);
            DeleteGalleryDirectory(gallery.GalleryId);
            _db.SaveChanges();
        }
         public async void Update(Gallery gallery)
        {
            _db.Entry(gallery).State = EntityState.Modified;
            _db.SaveChanges();

        }

    public async Task UpdateGallery(int id, IFormCollection formData)
        {
            // Counter for Image Files and image Caption
            int i = 0;
            int j = 0;

            // Will Hold the New Gallery Title
            string Title = formData["GalleryTitleEdit"];

            // Will Get the Details of the Gallery that needs to be Updated
            var oGallery = await _db.Galleries.FirstOrDefaultAsync(m => m.GalleryId == id);

            // Path of the Gallery that needs to be updated on Server
            string GalleryPath = Path.Combine(_env.WebRootPath + oGallery.GalleryUrl);

            // If we have received any files for update
            if (formData.Files.Count > 0)
            {
                // First we create an empty array to store old file info
                string[] filesToDeletePath = new string[formData.Files.Count];

                foreach (var file in formData.Files)
                {
                    if (file.Length > 0)
                    {
                        var extension = Path.GetExtension(file.FileName);
                        var filename = DateTime.Now.ToString("yymmssfff");
                        var path = Path.Combine(GalleryPath, filename) + extension;
                        var dbImagePath = Path.Combine(oGallery.GalleryUrl + $"{Path.DirectorySeparatorChar}", filename) + extension;
                        string ImageId = formData["imageId[]"][i];
                        // Get the info of the Image that needs to be updated
                        var updateImage = _db.GalleryImages.FirstOrDefault(o => o.ImageId == Convert.ToInt32(ImageId));

                        // First we will store path of each old file to delete in an empty array.
                        filesToDeletePath[i] = Path.Combine(_env.WebRootPath + updateImage.ImageUrl);
                        updateImage.ImageUrl = dbImagePath;

                        // Copying New Files to the Server - Gallery Folder
                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                                _db.Entry(updateImage).State = EntityState.Modified;
                                await _db.SaveChangesAsync();

                              
                        i = i + 1;
                    }
                }

                // Delete the Old Files
                foreach (var item in filesToDeletePath)
                {
                    // If Image file Exists - Delete the File inside the Gallery folder first
                    if (System.IO.File.Exists(item))
                    {
                        System.IO.File.SetAttributes(item, FileAttributes.Normal);
                        System.IO.File.Delete(item);
                    }


                }

            }
            // Contidion Validate and Update Gallery Title and image Caption
            if (formData["imageCaption[]"].Count > 0)
            {
                oGallery.Title = Title;
                _db.Entry(oGallery).State = EntityState.Modified;

                foreach (var imgcap in formData["imageCaption[]"])
                {
                    string ImageIdCap = formData["imageId[]"][j];
                    string Caption = formData["imageCaption[]"][j];
                    string Description = formData["description[]"][j];
                    string AltText = formData["altText[]"][j];
                    var updateImageDetails = _db.GalleryImages.FirstOrDefault(o => o.ImageId == Convert.ToInt32(ImageIdCap));
                    updateImageDetails.Caption = Caption;
                    updateImageDetails.Description = Description;
                    updateImageDetails.AlternateText = AltText;
                 

                            _db.Entry(updateImageDetails).State = EntityState.Modified;
                            await _db.SaveChangesAsync();

                    j = j + 1;
                }
            }

        }
                private void DeleteGalleryDirectory(int id) 
        {
            // First get the path of the Gallery folder
            string GalleryPath = Path.Combine(_env.WebRootPath + $"{Path.DirectorySeparatorChar}Uploads{Path.DirectorySeparatorChar}Gallery{Path.DirectorySeparatorChar}", id.ToString());

            // Store all the files with the gallery folder in this array
            string[] files = Directory.GetFiles(GalleryPath);

             // Check if the Gallery folder with that id exists
            if (Directory.Exists(GalleryPath))
            {
                // If Gallery Exists - Delete the Files inside the Gallery first
                foreach (var file in files)
                {
                    System.IO.File.SetAttributes(file, FileAttributes.Normal);
                    System.IO.File.Delete(file);
                }

                // Finally Delete the Gallery Folder
                Directory.Delete(GalleryPath);
            }

        }

    }

}