using AutoMapper;
using FrontEndPagoPA.Models;
using FrontEndPagoPA.Service;
using FrontEndPagoPA.ViewModel;
using log4net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace FrontEndPagoPA.Controllers
{
    public class IuvMultiploController : Controller
    {
        private readonly TokenProvider _tokenProvider;
        private readonly IMemoryCache _cache;
        private static readonly ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod()!.DeclaringType);
        private readonly IuvService _iuvService;
        private readonly IMapper _mapper;


        // GET: IuvMultiplo
        public IuvMultiploController(IMemoryCache cache, TokenProvider tokenProvider, IuvService iuvService, IMapper mapper)
        {
            _cache = cache;
            _tokenProvider = tokenProvider;
            _mapper = mapper;
            _iuvService = iuvService;
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GeneraBollettinoMultiplo()
        {
            _cache.Remove("list");
            return View();
        }

        public ActionResult GeneraBollettinoMultiplo_2()
        {
            return View();
        }

        public ActionResult RegistraBolletinoMutilpo(IFormCollection data)
        {
            Globals g = new(_tokenProvider);
            UserDto userDto = new();
            TokenDto token = g.GetDeserializedToken();

            var senderUserId = data["senderUserId"];
            var operationTypeId = data["operationTypeId"];
            var bullettin = data["bollettino"].ToString();

            var title = data["title"];
            bool bul = false;
            if (bullettin == "1")
                bul = true;

            var csv = ((List<CsvDtoOut>)_cache.Get("list")!).Where(a => a.valid == true).ToList();

            _cache.Set("list", csv);

            OperationViewModel ov = new()
            {
                title = title!,
                userId = token.sub,
                bollettino = bul,
                senderUserId = Convert.ToInt32(senderUserId),
                operationType = Convert.ToInt32(operationTypeId),
                debtPositions = null
            };

            _cache.Set("ov", ov);

            return Redirect("GeneraBollettinoMultiplo_2");
        }
        public ActionResult GeneraIuvMultiplo()
        {
            _cache.Remove("list");
            return View();
        }

        public async Task<ActionResult> RegisterOperation(IFormCollection data)
        {
            var ov = (OperationViewModel)_cache.Get("ov")!;

            var dbs = new List<DebtPositionDto>();

            var csv = (List<CsvDtoIn>)_cache.Get("list")!;
            foreach (var c in csv.Where(a => a.valid == true))
            {
                var db = new DebtPositionDto()
                {
                    anagraficaPagatore = c.nominativo,
                    bollettino = ov.bollettino,
                    codiceIdentificativoUnivocoPagatore = c.codicefiscale,
                    importoTotaleDaVersare = Convert.ToDecimal(c.totale),
                    tipoIdentificativoUnivocoPagatore = "F",
                    title = ov.title!,
                    uniqueInstallementExpirationDate = Convert.ToDateTime(c.dataScadenzaRataUnica),
                    installmentNumber = Convert.ToInt32(c.numeroRatei),
                    nomeFile = c.nomeFile!,
                    expirationInstallmentDate = Globals.GetExpirationInstallmentDate(c),
                    inputBase64File = c.inputBase64File!,
                    outputBase64File = string.Empty
                };

                dbs.Add(db);
            }

            ov.debtPositions = dbs;

            var response = await _iuvService.InsertOperation(ov);

            if (response == null)
                _logger.Error(" Error to new multiple IUV with bulletin");

            return Redirect("/Action/RequestComplete");
        }
        public async Task<ActionResult> RegistraOperazioneIuvMultiplo(IFormCollection data)
        {
            Globals g = new(_tokenProvider);
            UserDto userDto = new();
            TokenDto token = g.GetDeserializedToken();

            var senderUserId = data["senderUserId"];
            var operationTypeId = data["operationTypeId"];
            var bullettin = data["bollettino"].ToString();

            var title = data["title"];
            bool bul = false;
            if (bullettin == "1")
                bul = true;

            var csv = ((List<CsvDtoOut>)_cache.Get("list")!).Where(a => a.valid == true).ToList();

            var dbs = new List<DebtPositionDto>();
            foreach (var c in csv.Where(a => a.valid == true))
            {
                var cIn = _mapper.Map<CsvDtoIn>(c);
                var db = new DebtPositionDto()
                {
                    anagraficaPagatore = c.nominativo,
                    bollettino = bul,
                    codiceIdentificativoUnivocoPagatore = c.codicefiscale,
                    importoTotaleDaVersare = Convert.ToDecimal(c.totale),
                    tipoIdentificativoUnivocoPagatore = "F",
                    title = title!,
                    uniqueInstallementExpirationDate = Convert.ToDateTime(c.dataScadenzaRataUnica),
                    installmentNumber = Convert.ToInt32(c.numeroRatei),
                    nomeFile = c.nomeFile!,
                    expirationInstallmentDate = Globals.GetExpirationInstallmentDate(cIn)
                };

                dbs.Add(db);
            }

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
                _logger.Error(" Error to new multiple IUV");

            return Redirect("/Action/RequestComplete");
        }
    }
}