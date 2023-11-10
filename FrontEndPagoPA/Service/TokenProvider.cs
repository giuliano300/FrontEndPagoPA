using FrontEndPagoPA.Models;

namespace FrontEndPagoPA.Service
{
    public class TokenProvider
    {
        private readonly IHttpContextAccessor _contextAccessor;
        
        public TokenProvider(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }


        public void ClearToken()
        {
            _contextAccessor.HttpContext?.Response.Cookies.Delete(Globals.TokenCookie);
        }

        public string? GetToken()
        {
            string? token = null;
            bool? hasToken = _contextAccessor.HttpContext?.Request.Cookies.TryGetValue(Globals.TokenCookie, out token);
            return hasToken is true ? token : null;
        }

        public void SetToken(string token)
        {
            _contextAccessor.HttpContext?.Response.Cookies.Append(Globals.TokenCookie, token);
        }
    }
}
