using FrontEndPagoPA.Models;
using FrontEndPagoPA.ViewModel;
using static FrontEndPagoPA.Models.Globals;

namespace FrontEndPagoPA.Service
{
    public class IuvService
    {
        private readonly BaseService _baseService;


        public IuvService(BaseService baseService)
        {
            _baseService = baseService;
        }

        public async Task<ResponseDto> InsertOperation(OperationViewModel ov)
        {
            return await _baseService.SendAsync(new RequestDto()
            {
                ApiType = ApiType.POST,
                Data = ov,
                Url = apiPagoPABase + "/api/Operation/New"
            }, withBearer: true);
        }
    }
}