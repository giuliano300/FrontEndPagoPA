using FrontEndPagoPA.Models;
using static FrontEndPagoPA.Models.Globals;

namespace FrontEndPagoPA.Service
{
    public class HomeService
    {
        private readonly BaseService _baseService;
        public HomeService(BaseService baseService)
        {
            _baseService = baseService;
        }


        public async Task<ResponseDto> AssignRoleAsync(RegistrationRequestDto registrationRequestDto)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.POST,
                Data = registrationRequestDto,
                Url = apiPagoPABase + "/api/auth/assignRole"
            });
        }


        public async Task<ResponseDto> LoginAsync(LoginRequestDto loginRequestDto)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.POST,
                Data = loginRequestDto,
                Url = apiPagoPABase + "/api/auth/login"
            }, withBearer: false);
        }


        public async Task<ResponseDto> LogoutAsync(string userId)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Data = userId,
                Url = apiPagoPABase + "/api/auth/logout"
            }, withBearer: true);
        }


        public async Task<ResponseDto> RegisterAsync(RegistrationRequestDto registrationRequestDto)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.POST,
                Data = registrationRequestDto,
                Url = apiPagoPABase + "/api/auth/register"
            }, withBearer: true);
        }
    }
}
