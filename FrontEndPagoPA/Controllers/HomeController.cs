using FrontEndPagoPA.Models;
using FrontEndPagoPA.Service;
using Microsoft.AspNetCore.Authentication;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using log4net;
using System.Reflection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;



namespace FrontEndPagoPA.Controllers
{
    public class HomeController : Controller
    {
        private readonly TokenProvider _tokenProvider;
        private readonly HomeService _homeService;
        private static readonly ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod()!.DeclaringType);


        public HomeController(TokenProvider tokenProvider, HomeService homeService)
        {
            _homeService = homeService;
            _tokenProvider = tokenProvider;
        }


        public ActionResult Index()
        {
            var token = _tokenProvider.GetToken();

            if (token != null)
                return Redirect("/Home/Dashboard");

            return View();
        }


        [HttpPost]
        public async Task<IActionResult> Login(LoginRequestDto loginRequestDto)
        {
            ResponseDto responseDto = await _homeService.LoginAsync(loginRequestDto);

            if (responseDto != null && responseDto.IsSuccess)
            {
                LoginResponseDto loginResponseDto = JsonConvert.DeserializeObject<LoginResponseDto>(Convert.ToString(responseDto.Result)!)!;
                await SignInUser(loginResponseDto);
                _tokenProvider.SetToken(loginResponseDto.token);
                return Redirect("Dashboard");
            }
            else
            {
                ViewBag.error = "Username o password errati";
                return View("Index");
            }
        }



        private async Task SignInUser(LoginResponseDto model)
        {
            var handler = new JwtSecurityTokenHandler();

            var jwt = handler.ReadJwtToken(model.token);

            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);

            identity.AddClaim(new Claim(JwtRegisteredClaimNames.Email, jwt.Claims.FirstOrDefault(a => a.Type == JwtRegisteredClaimNames.Email)!.Value));
            identity.AddClaim(new Claim(JwtRegisteredClaimNames.Sub, jwt.Claims.FirstOrDefault(a => a.Type == JwtRegisteredClaimNames.Sub)!.Value));
            identity.AddClaim(new Claim("businessName", jwt.Claims.FirstOrDefault(a => a.Type == JwtRegisteredClaimNames.Name)!.Value));
            identity.AddClaim(new Claim("role", jwt.Claims.FirstOrDefault(a => a.Type == "role")!.Value));
            identity.AddClaim(new Claim("phoneNumber", jwt.Claims.FirstOrDefault(a => a.Type == "phoneNumber")!.Value));
            identity.AddClaim(new Claim("passwordHash", jwt.Claims.FirstOrDefault(a => a.Type == "passwordHash")!.Value));
            identity.AddClaim(new Claim("representative", jwt.Claims.FirstOrDefault(a => a.Type == "representative")!.Value));

            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        }



        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            _tokenProvider.ClearToken();
            return Redirect("Index");
        }



        [HttpPost]
        public bool CheckPwd(IFormCollection data)
        {
            Globals g = new(_tokenProvider);
            var token = g.GetDeserializedToken();
            var currentPwd = token.passwordHash;
            PasswordHasher<TokenDto> ph = new();

            if (ph.VerifyHashedPassword(token, currentPwd, data["pwd"]!) == PasswordVerificationResult.Failed)
                return false;

            return true;
        }



        public ActionResult Dashboard()
        {
            Globals g = new(_tokenProvider);
            TokenDto token;
            UserDto userDto = new();
            try
            {
                token = g.GetDeserializedToken();

                userDto.email = token.email;
                userDto.phoneNumber = token.phoneNumber;
                userDto.businessName = token.name;
                userDto.UserName = token.representative;
                userDto.role = token.role;
                userDto.id = token.sub;
                userDto.email = token.email;
            }
            catch (Exception ex)
            {
                _logger.Error("  An error occurred in the Dashboard() action in the Home controller  " + ex.Message);
                return View("Error");
            }
            return View(userDto);
        }
    }
}