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
                installmentDate += Convert.ToDateTime(r1).ToShortDateString() + ";";
            }

            var r2 = data["rata2"].ToString();
            if (r2 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r2).ToShortDateString() + ";";
            }

            var r3 = data["rata3"].ToString();
            if (r3 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r3).ToShortDateString() + ";";
            }

            var r4 = data["rata4"].ToString();
            if (r4 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r4).ToShortDateString() + ";";
            }

            var r5 = data["rata5"].ToString();
            if (r5 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r5).ToShortDateString() + ";";
            }

            var r6 = data["rata6"].ToString();
            if (r6 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r6).ToShortDateString() + ";";
            }

            var r7 = data["rata7"].ToString();
            if (r7 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r7).ToShortDateString() + ";";
            }

            var r8 = data["rata8"].ToString();
            if (r8 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r8).ToShortDateString() + ";";
            }

            var r9 = data["rata9"].ToString();
            if (r9 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r9).ToShortDateString() + ";";
            }

            var r10 = data["rata10"].ToString();
            if (r10 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r10).ToShortDateString() + ";";
            }

            var r11 = data["rata11"].ToString();
            if (r11 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r11).ToShortDateString() + ";";
            }

            var r12 = data["rata12"].ToString();
            if (r12 != "")
            {
                installmentNumber += 1;
                installmentDate += Convert.ToDateTime(r12).ToShortDateString() + ";";
            }

            var senderUserId = data["senderUserId"];
            var operationTypeId = data["operationTypeId"];
            var bullettin = data["bollettino"].ToString();

            var name = data["name"];
            var fiscalCode = data["fiscalCode"];
            var indirizzoPagatore = data["indirizzoPagatore"];
            var capPagatore = data["capPagatore"];
            var provinciaPagatore = data["provinciaPagatore"];
            var comunePagatore = data["comunePagatore"];

            var amount = data["amount"];
            var expirationDate = data["expirationDate"];
            var title = data["title"];

            if (installmentDate != "")
                installmentDate = installmentDate.Substring(0, installmentDate.Length - 1);

            bool bul = false;
            if (bullettin == "1")
                bul = true;

            var dbs = new List<DebtPositionDto>();

            //CARICA FILE
            var fileName = "";
            String? b = null;
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

                    //TRASFORMA FILE BASE 64
                    b = Globals.ConvertFileToBase64(webRootPath + Globals.FolderUniqueFile + fileName);

                    //ELIMINO FILE CARICATO
                    System.IO.File.Delete(directory);

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
                nomeFile = fileName,
                inputBase64File = b!,
                outputBase64File = string.Empty,
                indirizzoPagatore = indirizzoPagatore!,
                capPagatore = capPagatore!,
                provinciaPagatore = provinciaPagatore!,
                comunePagatore = comunePagatore!
            };

            dbs.Add(db);

            OperationViewModel ov = new()
            {
                title = title!,
                userId = token.sub,
                bollettino = bul,
                senderUserId = Convert.ToInt32(senderUserId),
                operationTypeId = Convert.ToInt32(operationTypeId),
                debtPositions = dbs
            };


            var response = await _iuvService.InsertOperation(ov);

            if (response == null)
                _logger.Error(" Error to new single IUV");

            return Convert.ToBoolean(response!.IsSuccess);
        }


    }
}