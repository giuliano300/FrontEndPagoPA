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
                i += Convert.ToDateTime(c.dataScadenzaRata1).ToShortDateString() + ";";
            if (c.dataScadenzaRata2 != null && c.dataScadenzaRata2 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata2).ToShortDateString() + ";";
            if (c.dataScadenzaRata3 != null && c.dataScadenzaRata3 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata3).ToShortDateString() + ";";
            if (c.dataScadenzaRata4 != null && c.dataScadenzaRata4 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata4).ToShortDateString() + ";";
            if (c.dataScadenzaRata5 != null && c.dataScadenzaRata5 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata5).ToShortDateString() + ";";
            if (c.dataScadenzaRata6 != null && c.dataScadenzaRata6 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata6).ToShortDateString() + ";";
            if (c.dataScadenzaRata7 != null && c.dataScadenzaRata7 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata7).ToShortDateString() + ";";
            if (c.dataScadenzaRata8 != null && c.dataScadenzaRata8 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata8).ToShortDateString() + ";";
            if (c.dataScadenzaRata9 != null && c.dataScadenzaRata9 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata9).ToShortDateString() + ";";
            if (c.dataScadenzaRata10 != null && c.dataScadenzaRata10 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata10).ToShortDateString() + ";";
            if (c.dataScadenzaRata11 != null && c.dataScadenzaRata11 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata11).ToShortDateString() + ";";
            if (c.dataScadenzaRata12 != null && c.dataScadenzaRata12 != "")
                i += Convert.ToDateTime(c.dataScadenzaRata12).ToShortDateString() + ";";

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
