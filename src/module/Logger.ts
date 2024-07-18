export class Logger {
	static LOG_LEVEL = {
		All: 0,
		Verbose: 1,
		Debug: 2,
		Trace: 3,
		Info: 4,
		Warn: 5,
		Error: 6,
		Fatal: 7
	} as const;

	static log({ message, level, options: { toast, permanent, localize } = {} }: LogMessage) {
		const isDebugging = 
			// @ts-expect-error
			game.modules
			.get('_dev-mode')
			?.api
			// @ts-expect-error
			?.getPackageDebugValue(game.system.id);

		if (!isDebugging) {
			if ((level < this.LOG_LEVEL.Info)  && (level > this.LOG_LEVEL.All))
				return;
		}

		if (level < Logger.outputLogLevel)
			return;

		// @ts-expect-error
		const prefix = game.system.id + ' | ' + Logger.translate(level) + ' | ';
		if (level === this.LOG_LEVEL.Debug) {
			// @ts-expect-error
			console.debug(prefix, localize ? game.i18n.localize(message) : message);
			Logger.toast(toast, message, level, { permanent, localize });
			return;
		}
		if (level === this.LOG_LEVEL.Error) {
			// @ts-expect-error
			console.error(prefix, localize ? game.i18n.localize(message) : message);
			Logger.toast(toast, message, level, { permanent, localize });
			return;
		}
		if (level === this.LOG_LEVEL.Fatal) {
			// @ts-expect-error
			console.error(prefix, localize ? game.i18n.localize(message) : message);
			Logger.toast(toast, message, level, { permanent, localize });
			return;
		}
		if (level === this.LOG_LEVEL.Info) {
			// @ts-expect-error
			console.info(prefix, localize ? game.i18n.localize(message) : message);
			Logger.toast(toast, message, level, { permanent, localize });
			return;
		}
		if (level === this.LOG_LEVEL.Trace) {
			// @ts-expect-error
			console.debug(prefix, localize ? game.i18n.localize(message) : message);
			Logger.toast(toast, message, level, { permanent, localize });
			return;
		}
		if (level === this.LOG_LEVEL.Warn) {
			// @ts-expect-error
			console.warn(prefix, localize ? game.i18n.localize(message) : message);
			Logger.toast(toast, message, level, { permanent, localize });
			return;
		}
		if (level === this.LOG_LEVEL.Verbose) {
			// @ts-expect-error
			console.debug(prefix, localize ? game.i18n.localize(message) : message);
			Logger.toast(toast, message, level, { permanent, localize });
			return;
		}
	}

	static outputLogLevel: ValueOf<typeof Logger.LOG_LEVEL> = Logger.LOG_LEVEL.All;
	static setLogLevel(level: ValueOf<typeof Logger.LOG_LEVEL>) {
		Logger.outputLogLevel = level;
	}

	static toast(toast: boolean | undefined, message: string, level: number, options: Notifications.Options = {}) {
		if (!toast)
			return;

		if (level === this.LOG_LEVEL.Debug) {
			// @ts-expect-error
			ui.notifications.info(message?.toString(), options);
			return;
		}
		if (level === this.LOG_LEVEL.Error) {
			// @ts-expect-error
			ui.notifications.error(message?.toString(), options);
			return;
		}
		if (level === this.LOG_LEVEL.Fatal) {
			// @ts-expect-error
			ui.notifications.error(message?.toString(), options);
			return;
		}
		if (level === this.LOG_LEVEL.Info) {
			// @ts-expect-error
			ui.notifications.info(message?.toString(), options);
			return;
		}
		if (level === this.LOG_LEVEL.Trace) {
			// @ts-expect-error
			ui.notifications.info(message?.toString(), options);
			return;
		}
		if (level === this.LOG_LEVEL.Warn) {
			// @ts-expect-error
			ui.notifications.warn(message?.toString(), options);
			return;
		}
		if (level === this.LOG_LEVEL.Verbose) {
			// @ts-expect-error
			ui.notifications.info(message?.toString(), options);
			return;
		}
	}

	static translate(level: ValueOf<typeof Logger.LOG_LEVEL>) {
		if (level === this.LOG_LEVEL.Debug)
			return 'DEBUG  ';
		if (level === this.LOG_LEVEL.Error)
			return 'ERROR  ';
		if (level === this.LOG_LEVEL.Fatal)
			return 'FATAL  ';
		if (level === this.LOG_LEVEL.Info)
			return 'INFO   ';
		if (level === this.LOG_LEVEL.Trace)
			return 'TRACE  ';
		if (level === this.LOG_LEVEL.Warn)
			return 'WARN   ';
		if (level === this.LOG_LEVEL.Verbose)
			return 'VERBOSE';
		return '       ';
	}

	static debug(message: any | string, options?: LogMessageOptions) {
		Logger.log({ message, level: Logger.LOG_LEVEL.Debug, options });
	}

	static error(message: any | string, options?: LogMessageOptions) {
		Logger.log({ message, level: Logger.LOG_LEVEL.Error, options });
	}

	static fatal(message: any | string, options?: LogMessageOptions) {
		Logger.log({ message, level: Logger.LOG_LEVEL.Fatal, options });
	}

	static info(message: any | string, options?: LogMessageOptions) {
		Logger.log({ message, level: Logger.LOG_LEVEL.Info, options });
	}

	static trace(message: any | string, options?: LogMessageOptions) {
		Logger.log({ message, level: Logger.LOG_LEVEL.Warn, options });
	}

	static warn(message: any | string, options?: LogMessageOptions) {
		Logger.log({ message, level: Logger.LOG_LEVEL.Warn, options });
	}

	static verbose(message: any | string, options?: LogMessageOptions) {
		Logger.log({ message, level: Logger.LOG_LEVEL.Warn, options });
	}
}

interface LogMessage {
	message: any;
	options?: LogMessageOptions;
	/** The log level @see {@link Logger.LOG_LEVEL} */
	level: ValueOf<typeof Logger.LOG_LEVEL>;
}

interface LogMessageOptions extends Notifications.Options {
	toast?: boolean;
}
