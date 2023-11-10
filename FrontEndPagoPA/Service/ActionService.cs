using FrontEndPagoPA.Models;
using static FrontEndPagoPA.Models.Globals;

namespace FrontEndPagoPA.Service
{
    public class ActionService
    {
        private readonly BaseService _baseService;


        public ActionService(BaseService baseService)
        {
            _baseService = baseService;
        }


        public async Task<ResponseDto> GetInstallmentsAsync(string userId, bool? worked, string? today, bool? paid, bool? valid, int page = 1, int itemsPerPage = 100, string append = "")
        {
            var queryString = $"?userId={userId}&worked={worked}&today={today}&paid={paid}&valid={valid}&page={page}&itemsPerPage={itemsPerPage}{append}";

            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/installment" + queryString
            });
        }

        public async Task<ResponseDto> GetRendicontazione(string userId, string? today, bool? paid, string append)
        {
            var queryString = $"?userId={userId}&today={today}&paid={paid}{append}";

            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/installment/GetRendicontazione" + queryString
            });
        }

        public async Task<ResponseDto> GetIUV(string userId, bool? worked, string? today, string append = "")
        {
            var queryString = $"?userId={userId}&worked={worked}&today={today}{append}";

            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/installment/GetIUV" + queryString
            });
        }

        public async Task<ResponseDto> GetOperationTypes()
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/OperationType/"
            }, withBearer: true);
        }


        public async Task<ResponseDto> GetOperationTypesSenderUsers(int senderUserId)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/OperationTypesSenderUser?senderUserId=" + senderUserId
            }, withBearer: true);
        }
        public async Task<ResponseDto> GetOperationsByUserId(string id, string? today, int page = 1, int itemsPerPage = 100, string append = "")
        {
            var queryString = $"?id={id}&today={today}&page={page}&itemsPerPage={itemsPerPage}{append}";

            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/Operation/GetOperationsByUserId/" + queryString
            }, withBearer: true);
        }
        public async Task<ResponseDto> GetIUVFromOperation(int id)
        {
            var queryString = $"?id={id}";

            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/Operation/GetIuvFromOperation" + queryString
            }, withBearer: true);
        }
        public async Task<ResponseDto> GetFilesFromOperation(int id)
        {
            var queryString = $"?id={id}";

            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.GET,
                Url = apiPagoPABase + "/api/Operation/GetFilesFromOperation" + queryString
            }, withBearer: true);
        }
    }
}