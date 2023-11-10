using Microsoft.AspNetCore.Identity;

namespace FrontEndPagoPA.Models
{
    public class TokenDto
    {
        public string email { get; set; }
        public string sub { get; set; }
        public string name { get; set; }
        public string phoneNumber { get; set; }
        public string passwordHash { get; set; }
        public string representative { get; set; }
        public string role { get; set; }
        public long nbf { get; set; }
        public long exp { get; set; }
        public long iat { get; set; }
        public string iss { get; set; }
        public string aud { get; set; }
    }
}
