using NLog;
using ILogger = NLog.ILogger;

namespace Sept2417.Logger
{
	/// <summary>
	/// Provides logging interface and utility functions.
	/// </summary>
	public interface ILoggerService
	{
		/// <summary>
		/// Writes the diagnostic message at the <c>Trace</c> level.
		/// </summary>
		/// <param name="message">The message to be written.</param>
		/// <remarks>Most verbose level. Used for development and seldom enabled in production.</remarks>
		void Trace(string message);

		/// <summary>
		/// Writes the diagnostic message at the <c>Debug</c> level.
		/// </summary>
		/// <param name="message">The message to be written.</param>
		/// <remarks>Debugging the application behavior from internal events of interest.</remarks>
		void Debug(string message);

		/// <summary>
		/// Writes the diagnostic message at the <c>Info</c> level.
		/// </summary>
		/// <param name="message">The message to be written.</param>
		/// <remarks>Information that highlights progress or application lifetime events.</remarks>
		void Info(string message);

		/// <summary>
		/// Writes the diagnostic message and exception at the <c>Warn</c> level.
		/// </summary>
		/// <param name="message">A <see langword="string" /> to be written.</param>
		/// <remarks>Warnings about validation issues or temporary failures that can be recovered.</remarks>
		void Warning(string message);

		/// <summary>
		/// Writes the diagnostic message and exception at the <c>Error</c> level.
		/// </summary>
		/// <param name="message">The error message to be written.</param>
		/// <remarks>Errors where functionality has failed or Exception have been caught.</remarks>
		void Error(string message);

		/// <summary>
		/// Writes the diagnostic message and exception at the <c>Error</c> level.
		/// </summary>
		/// <param name="ex">An <see cref="System.Exception"/> to be logged.</param>
		/// <param name="message">A <see langword="string" /> to be written.</param>
		/// <remarks>Errors where functionality has failed or Exception have been caught.</remarks>
		void Error(Exception ex, string message);

		/// <summary>
		/// Writes the diagnostic message and exception at the <c>Fatal</c> level.
		/// </summary>
		/// <param name="message">A <see langword="string" /> to be written.</param>
		/// <remarks>Most critical level. Application is about to abort.</remarks>
		void Critical(string message);
	}

	/// <summary>
	/// Provides logging interface and utility functions.
	/// </summary>
	public class LoggerService : ILoggerService
	{
		private static readonly ILogger _log = LogManager.GetCurrentClassLogger();

		/// <summary>
		/// Writes the diagnostic message at the <c>Trace</c> level.
		/// </summary>
		/// <param name="message">The message to be written.</param>
		/// <remarks>Most verbose level. Used for development and seldom enabled in production.</remarks>
		public void Trace(string message)
		{
			_log.Trace(message);
		}

		/// <summary>
		/// Writes the diagnostic message at the <c>Debug</c> level.
		/// </summary>
		/// <param name="message">The message to be written.</param>
		/// <remarks>Debugging the application behavior from internal events of interest.</remarks>
		public void Debug(string message)
		{
			_log.Debug(message);
		}

		/// <summary>
		/// Writes the diagnostic message at the <c>Info</c> level.
		/// </summary>
		/// <param name="message">The message to be written.</param>
		/// <remarks>Information that highlights progress or application lifetime events.</remarks>
		public void Info(string message)
		{
			_log.Info(message);
		}

		/// <summary>
		/// Writes the diagnostic message and exception at the <c>Warn</c> level.
		/// </summary>
		/// <param name="message">A <see langword="string" /> to be written.</param>
		/// <remarks>Warnings about validation issues or temporary failures that can be recovered.</remarks>
		public void Warning(string message)
		{
			_log.Warn(message);
		}

		/// <summary>
		/// Writes the diagnostic message and exception at the <c>Error</c> level.
		/// </summary>
		/// <param name="message">The error message to be written.</param>
		/// <remarks>Errors where functionality has failed or Exception have been caught.</remarks>
		public void Error(string message)
		{
			_log.Error(message);
		}

		/// <summary>
		/// Writes the diagnostic message and exception at the <c>Error</c> level.
		/// </summary>
		/// <param name="ex">An <see cref="System.Exception"/> to be logged.</param>
		/// <param name="message">A <see langword="string" /> to be written.</param>
		/// <remarks>Errors where functionality has failed or Exception have been caught.</remarks>
		public void Error(Exception ex, string message)
		{
			_log.Error(ex, message);
		}

		/// <summary>
		/// Writes the diagnostic message and exception at the <c>Fatal</c> level.
		/// </summary>
		/// <param name="message">A <see langword="string" /> to be written.</param>
		/// <remarks>Most critical level. Application is about to abort.</remarks>
		public void Critical(string message)
		{
			_log.Fatal(message);
		}
	}
}
