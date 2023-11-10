using FrontEndPagoPA.Models;
using FrontEndPagoPA.Service;
using FrontEndPagoPA.ViewModel;
using log4net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace FrontEndPagoPA.Controllers
{
    public class IuvSingoloController : Controller
    {
        private readonly TokenProvider _tokenProvider;
        private static readonly ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod()!.DeclaringType);
        private readonly IuvService _iuvService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        // GET: IuvSingolo
        public IuvSingoloController(TokenProvider tokenProvider, IuvService iuvService, IWebHostEnvironment webHostEnvironment)
        {
            _tokenProvider = tokenProvider;
            _iuvService = iuvService;
            _webHostEnvironment = webHostEnvironment;
        }

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GeneraBollettino()
        {
            return View();
        }
        public ActionResult GeneraIuv()
        {
           return View();
        }
        public async Task<bool> RegisterOperation(IFormCollection data)
        {
            Globals g = new(_tokenProvider);
            UserDto userDto = new();
            TokenDto token = g.GetDeserializedToken();


            int installmentNumber = 0;
            string installmentDate = "";

            var r1 = data["rata1"].ToString();
            if (r1 != "")
            {
                installmentNumber += 1;
                installmentDate += r1 + ";";
            }

            var r2 = data["rata2"].ToString();
            if (r2 != "")
            {
                installmentNumber += 1;
                installmentDate += r2 + ";";
            }

            var r3 = data["rata3"].ToString();
            if (r3 != "")
            {
                installmentNumber += 1;
                installmentDate += r3 + ";";
            }

            var r4 = data["rata4"].ToString();
            if (r4 != "")
            {
                installmentNumber += 1;
                installmentDate += r4 + ";";
            }

            var r5 = data["rata5"].ToString();
            if (r5 != "")
            {
                installmentNumber += 1;
                installmentDate += r5 + ";";
            }

            var r6 = data["rata6"].ToString();
            if (r6 != "")
            {
                installmentNumber += 1;
                installmentDate += r6 + ";";
            }

            var r7 = data["rata7"].ToString();
            if (r7 != "")
            {
                installmentNumber += 1;
                installmentDate += r7 + ";";
            }

            var r8 = data["rata8"].ToString();
            if (r8 != "")
            {
                installmentNumber += 1;
                installmentDate += r8 + ";";
            }

            var r9 = data["rata9"].ToString();
            if (r9 != "")
            {
                installmentNumber += 1;
                installmentDate += r9 + ";";
            }

            var r10 = data["rata10"].ToString();
            if (r10 != "")
            {
                installmentNumber += 1;
                installmentDate += r10 + ";";
            }

            var r11 = data["rata11"].ToString();
            if (r11 != "")
            {
                installmentNumber += 1;
                installmentDate += r11 + ";";
            }

            var r12 = data["rata12"].ToString();
            if (r12 != "")
            {
                installmentNumber += 1;
                installmentDate += r12 + ";";
            }

            var senderUserId = data["senderUserId"];
            var operationTypeId = data["operationTypeId"];
            var bullettin = data["bollettino"].ToString();

            var name = data["name"];
            var fiscalCode = data["fiscalCode"];

            var amount = data["amount"];
            var expirationDate = data["expirationDate"];
            var title = data["title"];

            if (installmentDate != "")
                installmentDate = installmentDate.Substring(0, installmentDate.Length - 1);

            bool bul = false;
            if (bullettin == "1")
                bul = true;

            var dbs = new List<DebtPositionDto>();


            var fileName = "";
            if(data.Files.Count > 0) { 
                var upload = data.Files[0];
                if (upload != null && upload.Length > 0)
                {
                    string webRootPath = _webHostEnvironment.WebRootPath;
                    fileName = DateTime.Now.Ticks + Path.GetExtension(upload.FileName);
                    var directory = webRootPath + Globals.FolderUniqueFile + fileName;
                    using (var fileSrteam = new FileStream(directory, FileMode.Create))
                    {
                        await upload.CopyToAsync(fileSrteam);
                    }
                }
            }


            var db = new DebtPositionDto()
            {
                title = title!,
                anagraficaPagatore = name!, 
                codiceIdentificativoUnivocoPagatore = fiscalCode!,
                expirationInstallmentDate = installmentDate!,
                importoTotaleDaVersare = Convert.ToDecimal(amount),
                installmentNumber = installmentNumber, 
                uniqueInstallementExpirationDate = Convert.ToDateTime(expirationDate),
                tipoIdentificativoUnivocoPagatore = "F",
                bollettino = bul,
                nomeFile = Globals.FolderUniqueFile + fileName
            };

            dbs.Add(db);

            OperationViewModel ov = new()
            {
                title = title!,
                userId = token.sub,
                bollettino = bul,
                senderUserId = Convert.ToInt32(senderUserId),
                operationType = Convert.ToInt32(operationTypeId),
                debtPositions = dbs
            };


            var response = await _iuvService.InsertOperation(ov);

            if (response == null)
                _logger.Error(" Error to new single IUV");

            return Convert.ToBoolean(response!.IsSuccess);
        }


    }
}