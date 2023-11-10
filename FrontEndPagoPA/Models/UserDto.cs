using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace FrontEndPagoPA.Models
{
    public class UserDto
    {
        public string id { get; set; }
        public string email { get; set; }
        public string? currentPassword { get; set; }
        public string? newPassword { get; set; }
        public string? confirmNewPassword { get; set; }
        public string PasswordHash { get; set; }
        public string UserName { get; set; }
        public string businessName { get; set; }
        public string phoneNumber { get; set; }
        public string role { get; set; }
    }
}
