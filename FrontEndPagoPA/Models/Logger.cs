using log4net;
using System.Reflection;
namespace FrontEndPagoPA.Models
{
    public interface ILogger
    {
        void Debug(string message);
        void Info(string message);
        void Error(string message, Exception? ex = null);
    }
    public class Logger : ILogger
    {
        private readonly ILog _logger;
        public Logger()
        {
            _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod()?.DeclaringType);
        }
        public void Debug(string message)
        {
            _logger?.Debug(message);
        }
        public void Info(string message)
        {
            _logger?.Info(message);
        }
        public void Error(string message, Exception? ex = null)
        {
            _logger?.Error(message, ex?.InnerException);
        }
    }
}