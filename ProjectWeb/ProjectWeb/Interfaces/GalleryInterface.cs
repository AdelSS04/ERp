using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
namespace ProjectWeb.Interfaces
{
  public  interface GalleryInterface
    {
    Task<IEnumerable<Gallery>> GetAllGalleries();
    Object GetFeaturedImageGallery(string galleryType);
    Object GetImageGalleryById(int id);

        Object GetFeaturedGallery(string galleryType);

        Task<Boolean> CreateNewGallery(IFormCollection formdata);
    void Delete(Gallery gallery);
    void Update(Gallery gallery);

    Task UpdateGallery(int id, IFormCollection formData);

    Task<Gallery> GetGalleryById(int id);
    }
}
