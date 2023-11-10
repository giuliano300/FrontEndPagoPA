using FrontEndPagoPA.Models;
using static FrontEndPagoPA.Models.Globals;

namespace FrontEndPagoPA.Service
{
    public class AuthService
    {
        private readonly BaseService _baseService;


        public AuthService(BaseService baseService)
        {
            _baseService = baseService;
        }


        public async Task<ResponseDto> GetSenderUsersAsync(string id)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/SenderUser/" + id
            }, withBearer: true);
        }


        public async Task<ResponseDto> GetUserByIdAsync(string id)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/auth/" + id
            }, withBearer: true);
        }


        public async Task<ResponseDto> GetSenderUsersByIdAsync(int id)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/SenderUser/GetSenderUserById/" + id
            }, withBearer: true);
        }


        public async Task<ResponseDto> UpdatePersonalAreaAsync(UserDto userDto)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.POST,
                Data = userDto,
                Url = apiPagoPABase + "/api/auth/update"
            }, withBearer: true);
        }


        public async Task<ResponseDto> UpdateSenderUserAsync(SenderUserDto senderUserDto)
        {
            var r =  await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.POST,
                Data = senderUserDto,
                Url = apiPagoPABase + "/api/SenderUser/update"
            }, withBearer: true);
            return r;
        }


        public async Task<ResponseDto> CreateSenderUserAsync(SenderUserDto senderUserDto)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.POST,
                Data = senderUserDto,
                Url = apiPagoPABase + "/api/SenderUser/create"
            }, withBearer: true);
        }


        public async Task<ResponseDto> CreateMultipleFromSenderUser(List<string> i , int senderUserId)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.POST,
                Data = i,
                Url = apiPagoPABase + "/api/OperationTypesSenderUser/createMultipleFromSenderUser?senderUserId=" + senderUserId
            }, withBearer: true);
        } 


        public async Task<ResponseDto> DeleteSenderUserAsync(int id)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.DELETE,
                Url = apiPagoPABase + "/api/SenderUser/" + id
            }, withBearer: true);
        }
    }
}
