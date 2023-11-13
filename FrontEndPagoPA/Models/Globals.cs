using FrontEndPagoPA.Service;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Text.RegularExpressions;

namespace FrontEndPagoPA.Models
{
    public class Globals
    {
        private readonly TokenProvider _tokenProvider;
        public static string? apiPagoPABase;
        public const string TokenCookie = "JwtToken";
        public const string RoleAdmin = "ADMIN";
        public const string RoleCustomer = "CUSTOMER";
        public const string FolderUniqueFile = "/Public/Files/";
        public const string FolderCsv = "/Public/Csv/";
        public const string FolderZip = "/Public/Zip/";
        public const string FolderDownloadCsv = "/Public/DownloadCsv/";
        public const string FolderDownloadZip = "/Public/DownloadZip/";
        public enum ApiType
        {
            GET,
            POST,
            PUT,
            DELETE
        }

        public Globals(TokenProvider tokenProvider)
        {
            _tokenProvider = tokenProvider;
        }

        public TokenDto GetDeserializedToken()
        {
            var t = _tokenProvider.GetToken();
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(t);
            var p = jwtToken.Payload.SerializeToJson();
            return JsonConvert.DeserializeObject<TokenDto>(p)!;
        }

        public static string GetExpirationInstallmentDate(CsvDtoIn c)
        {
            var i = "";
            if (c.dataScadenzaRata1 != null && c.dataScadenzaRata1 != "")
                i += c.dataScadenzaRata1 + ";";
            if (c.dataScadenzaRata2 != null && c.dataScadenzaRata2 != "")
                i += c.dataScadenzaRata2 + ";";
            if (c.dataScadenzaRata3 != null && c.dataScadenzaRata3 != "")
                i += c.dataScadenzaRata3 + ";";
            if (c.dataScadenzaRata4 != null && c.dataScadenzaRata4 != "")
                i += c.dataScadenzaRata4 + ";";
            if (c.dataScadenzaRata5 != null && c.dataScadenzaRata5 != "")
                i += c.dataScadenzaRata5 + ";";
            if (c.dataScadenzaRata6 != null && c.dataScadenzaRata6 != "")
                i += c.dataScadenzaRata6 + ";";
            if (c.dataScadenzaRata7 != null && c.dataScadenzaRata7 != "")
                i += c.dataScadenzaRata7 + ";";
            if (c.dataScadenzaRata8 != null && c.dataScadenzaRata8 != "")
                i += c.dataScadenzaRata8 + ";";
            if (c.dataScadenzaRata9 != null && c.dataScadenzaRata9 != "")
                i += c.dataScadenzaRata9 + ";";
            if (c.dataScadenzaRata10 != null && c.dataScadenzaRata10 != "")
                i += c.dataScadenzaRata10 + ";";
            if (c.dataScadenzaRata11 != null && c.dataScadenzaRata11 != "")
                i += c.dataScadenzaRata11 + ";";
            if (c.dataScadenzaRata12 != null && c.dataScadenzaRata12 != "")
                i += c.dataScadenzaRata12 + ";";

            if(i != "")
                i = i.Substring(0 , i.Length - 1);

            return i;
        }


        public static bool CheckFc(string input)
        {
            string pattern = @"^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9]{11})$";            

            if(new Regex(pattern).Match(input).Success)
               return true;

            return false;
        }

        public static string ConvertBase64ToFile(string path, string b64Str)
        {
            Byte[] bytes = Convert.FromBase64String(b64Str);
            File.WriteAllBytes(path, bytes);

            return path;
        }

        public static string ConvertFileToBase64(string path)
        {
            Byte[] bytes = File.ReadAllBytes(path);
            String file = Convert.ToBase64String(bytes);

            return file;
        }

    }
}
