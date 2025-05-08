using FrontEndPagoPA.Models;
using FrontEndPagoPA.Service;
using log4net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System.Reflection;

namespace FrontEndPagoPA.Controllers
{
    public class UserController : Controller
    {
        private readonly TokenProvider _tokenProvider;
        private static readonly ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod()!.DeclaringType);
        private readonly AuthService _authService;
        private readonly ActionService _actionService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public UserController(TokenProvider tokenProvider, AuthService authService, ActionService actionService , IWebHostEnvironment webHostEnvironment)
        {
            _tokenProvider = tokenProvider;
            _authService = authService;
            _actionService = actionService;
            _webHostEnvironment = webHostEnvironment;
        }


        public ActionResult PersonalArea()
        {
            Globals g = new(_tokenProvider);
            UserDto userDto = new();
            TokenDto token;
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
                _logger.Error("  An error occurred in the PersonalArea() action in the User controller  " + ex.Message);
                return View("Error");
            }
            return View(userDto);
        }


        [HttpPost]
        public async Task<IActionResult> PersonalArea(IFormCollection model)
        {
            Globals g = new(_tokenProvider);
            PasswordHasher<UserDto> ph = new();
            UserDto u = new();

            if (ModelState.IsValid)
            {
                var currentToken = g.GetDeserializedToken();

                u = new()
                {
                    businessName = model["businessName"]!,
                    UserName = model["representative"]!,
                    id = currentToken.sub,
                    email = model["email"]!,
                    role = currentToken.role,
                    phoneNumber = currentToken.phoneNumber,
                    PasswordHash = currentToken.passwordHash,
                    currentPassword = model["currentPassword"],
                    newPassword = model["newPassword"],
                    confirmNewPassword = model["confirmNewPassword"]
                };

                if (u.currentPassword != "")
                {
                    if (ph.VerifyHashedPassword(u, currentToken.passwordHash, u.currentPassword!) == PasswordVerificationResult.Failed)
                    {
                        _logger.Error("  The current password is different from the newly inputted password  ");
                        return View(u);
                    }
                    if (u.newPassword != u.confirmNewPassword)
                    {
                        _logger.Error("  New password is different from confirm new password  ");
                        return View(u);
                    }
                    u.PasswordHash = ph.HashPassword(u, u.newPassword!);
                }

                if (u.email == null || u.email == "")
                    u.email = currentToken.email;

                var response = await _authService.UpdatePersonalAreaAsync(u);

                if (response == null)
                {
                    _logger.Error("  An error occurred while updating the PersonalArea(IFormCollection) of user with id = " + u.id + "  ");
                    return View("Error");
                }
                string token = response.Result!.ToString()!;
                _tokenProvider.SetToken(token);
            }
            return Redirect("PersonalArea");
        }


        public ActionResult AddUser()
        {
            ViewBag.operationTypesId = "[]";
            ViewBag.type = "Aggiungi";
            SenderUserDto s = new();
            return View(s);
        }


        public async Task<IActionResult> SaveUser(IFormCollection model)
        {
            Globals g = new(_tokenProvider);
            TokenDto token;
            try
            {
                token = g.GetDeserializedToken();

                if (ModelState.IsValid)
                {
                    var op = model["operationTypeId"].ToList();

                    var ccP = model["contoPostale"].ToString();
                    var ccB = model["contoBanca"].ToString();

                    var CBILL = model["CBILL"].ToString();
                    var numeroContoPoste = model["numeroContoPoste"].ToString();

                    bool contoPosta = false;
                    if (ccP == "on")
                        contoPosta = true;

                    bool contoBanca = false;
                    if (ccB == "on")
                        contoBanca = true;

                    var name = "";

                    if (model.Files.Count > 0)
                    {
                        var upload = model.Files[0];

                        if (upload != null && upload.Length > 0)
                        {
                            var fileName = Path.GetFileName(upload.FileName);
                            string webRootPath = _webHostEnvironment.WebRootPath;
                            name = "/Public/Logos/" + DateTime.Now.Ticks + Path.GetExtension(upload.FileName);
                            var directory = webRootPath + name;
                            using (var fileSrteam = new FileStream(directory, FileMode.Create))
                            {
                                await upload.CopyToAsync(fileSrteam);
                            }
                        }
                    }
                    else
                        name = model["fileOld"]!;

                    SenderUserDto su = new()
                    {
                        id = Convert.ToInt32(model["id"]!),
                        businessName = model["businessName"]!,
                        identificativoDominio = model["cod_fisc"]!,
                        identificativoBU = model["identificativoBU"]!,
                        address = model["address"]!,
                        cap = model["cap"]!,
                        city = model["city"]!,
                        province = model["province"]!,
                        userId = token.sub,
                        contoBanca = contoBanca,
                        contoPoste = contoPosta,
                        logo = name,
                        numeroContoPoste = numeroContoPoste,
                        CBILL = CBILL
                    };
                    var response = new ResponseDto();

                    int senderUserId = 0;

                    if (model["id"].ToString() == "0")
                    {
                        response = await _authService.CreateSenderUserAsync(su);
                        senderUserId = JsonConvert.DeserializeObject<SenderUserDto>(response.Result!.ToString()!)!.id;
                    }
                    else
                    {
                        senderUserId = Convert.ToInt32(model["id"]);
                        response = await _authService.UpdateSenderUserAsync(su);
                    }

                    if (response == null)
                    {
                        _logger.Error("  An error occurred while creating/updating a new SenderUser in the SaveUser action  ");
                        return View("Error");
                    }

                    //INSERT OperationTypeId in OperationTypeSenderUser
                    await _authService.CreateMultipleFromSenderUser(op!, senderUserId);
                }
            }
            catch (Exception ex)
            {
                _logger.Error("  An error occurred in the SaveUser action in the Home controller  " + ex.Message);
                return View("Error");
            }
            return Redirect("UsersList");
        }


        public async Task<IActionResult> EditUser(int id)
        {

            ViewBag.type = "Modifica";
            var response = await _authService.GetSenderUsersByIdAsync(id);
            SenderUserDto s = JsonConvert.DeserializeObject<SenderUserDto>(response.Result!.ToString()!)!;

            response = await _actionService.GetOperationTypesSenderUsers(id);

            var r = JsonConvert.DeserializeObject<List<OperationTypesSenderUserDto>>(Convert.ToString(response.Result)!)!;

            ViewBag.operationTypesId = JsonConvert.SerializeObject(r.Select(a => a.operationTypeId));

            return View("AddUser", s);
        }


        public async Task<string> GetOperationTypeSenderUser(int id)
        {

            var response = await _actionService.GetOperationTypesSenderUsers(id);

            var r = JsonConvert.DeserializeObject<List<OperationTypesSenderUserDto>>(Convert.ToString(response.Result)!)!;

            ViewBag.operationTypesId = JsonConvert.SerializeObject(r.Select(a => a.operationTypeId));

            return JsonConvert.SerializeObject(r);
        }


        public async Task<IActionResult> UsersList()
        {
            Globals g = new(_tokenProvider);
            TokenDto token;
            List<SenderUserDto> model = new();

            try
            {
                token = g.GetDeserializedToken();
                ResponseDto rs = await _authService.GetSenderUsersAsync(token.sub);

                if (rs is not null && rs.IsSuccess)
                    model = JsonConvert.DeserializeObject<List<SenderUserDto>>(Convert.ToString(rs.Result)!)!;
                else
                    _logger.Error(rs!.Message);
            }
            catch (Exception ex)
            {
                _logger.Error("  An error occurred in the UsersList() action in the User controller  " + ex.Message);
                return View("Error");
            }
            return View(model);
        }

        public async Task<string> GetUsers()
        {
            Globals g = new(_tokenProvider);
            TokenDto token;
            List<SenderUserDto>? model = new();

            try
            {
                token = g.GetDeserializedToken();
                ResponseDto rs = await _authService.GetSenderUsersAsync(token.sub);

                if (rs is not null && rs.IsSuccess)
                    model = JsonConvert.DeserializeObject<List<SenderUserDto>>(Convert.ToString(rs.Result)!)!;
                else
                {
                    model = null;
                     _logger.Error(rs!.Message);
                }
            }
            catch (Exception ex)
            {
                _logger.Error("  An error occurred in the UsersList() action in the User controller  " + ex.Message);
                model = null;
            }
            return JsonConvert.SerializeObject(model);
        }


        public async Task<IActionResult> DeleteSenderUser(int id)
        {
            try
            {
                ResponseDto r = await _authService.DeleteSenderUserAsync(id);

                if (r is not null && r.IsSuccess)
                {
                    return RedirectToAction("UsersList");
                }
                else
                {
                    _logger.Error(r!.Message);
                    return View("Error");
                }
            }
            catch (Exception ex)
            {
                _logger.Error("  An error occurred while deleting a Sender User in the DeleteSenderUser() action in the User controller  " + ex.Message);
                return View("Error");
            }
        }
    }
}
