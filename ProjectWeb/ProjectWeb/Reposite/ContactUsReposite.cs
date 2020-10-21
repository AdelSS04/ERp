using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Data;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Reposite
{
    public class ContactUsReposite : ContactUsInterface
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public ContactUsReposite(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;

        }
        public async Task<List<ContactUs>> GetAllMessages()
        {
            List<ContactUs> Items = await _applicationDbContext.contactUs.ToListAsync();

            return Items;
        }
        public async Task<EntityEntry<ContactUs>> AddMessage(ContactUs formdata)
        {
            var result = await _applicationDbContext.contactUs.AddAsync(formdata);
            try
            {
                await _applicationDbContext.SaveChangesAsync();
                return result;
            }
            catch (Exception)
            {

                return null; ;
            }
        }

    }
}
