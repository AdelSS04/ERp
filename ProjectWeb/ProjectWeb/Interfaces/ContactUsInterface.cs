using Microsoft.EntityFrameworkCore.ChangeTracking;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Interfaces
{
    public interface ContactUsInterface
    {
        Task<List<ContactUs>> GetAllMessages();
        Task<EntityEntry<ContactUs>> AddMessage(ContactUs formdata);

    }
}
