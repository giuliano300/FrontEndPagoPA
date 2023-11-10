using FrontEndPagoPA.Models;

namespace FrontEndPagoPA.Models
{
    public class LoginResponseDto
    {
        public UserDto user { get; set; }
        public string token { get; set; }
    }
}
