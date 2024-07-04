const AsciiArt = {};

// this code originates with http://github.com/scottgonzalez/figlet-js
// if that ever makes it to NPM, it will become a dependency
AsciiArt.Figlet = {
	fonts: {},
	fontPath: '/Fonts/',
	parseFont: function (name, fn) {
		if (AsciiArt.Figlet.fonts[name]) 
			fn(AsciiArt.Figlet.fonts[name]);
		else 
			AsciiArt.Figlet.loadFont(name, function (defn) {
				AsciiArt.Figlet._parseFont(name, defn, function (font) {
					AsciiArt.Figlet.fonts[name] = font;
					fn(font);
				});
			});
	},
	_parseFont: function (name, defn, fn) {
		const lines = defn.split('\n');
		const header = lines[0].split(' ');
		const hardblank = header[0].charAt(header[0].length - 1);
		const height = +header[1];
		const comments = +header[5];
		const font = {
			defn: lines.slice(comments + 1),
			hardblank: hardblank,
			height: height,
			char: {}
		};
		fn(font);
	},
	parseChar: function (char, font) {
		if (char > 122) 
			return;
		if (char in font.char) 
			return font.char[char];

		const height = font.height,
			start = (char - 32) * height,
			charDefn = [];
		for (let i = 0; i < height; i++) {
			if (!font.defn[start + i]) return;
			charDefn[i] = font.defn[start + i].replace(/@/g, '')
				.replace(RegExp('\\' + font.hardblank, 'g'), ' ');
		}
		return font.char[char] = charDefn;
	},
	loadFont: function (name, fn) {
		//const fs = require('fs');
		const fileName = this.fontPath + name + '.flf';
		// fs.readFile(fileName, 'utf8', function(error, data) {
		//	 if(error) throw(error);
		//	 if(data) fn(data);
		// });
		fetch(fileName)
			.then(r => r.text())
			.then(t => fn(t))
	},
	write: function (str, fontName, callback) {
		AsciiArt.Figlet.parseFont(fontName, function (font) {
			const chars = {};
			let result = '';
			for (var i = 0, len = str.length; i < len; i++) {
				chars[i] = AsciiArt.Figlet.parseChar(str.charCodeAt(i), font);
			}
			for (var i = 0, height = chars[0].length; i < height; i++) {
				for (var j = 0; j < len; j++) {
					if (chars[j]) 
                        result += chars[j][i];
				}
				result += '\n';
			}
			callback(result, font);
		});
	}
};

AsciiArt.Figlet.newReturnContext = function (options) {
	return new Promise(function (resolve, reject) {
		try {
			AsciiArt.Figlet.create(options, function (err, rendered) {
				resolve(rendered);
			});
		} 
		catch (ex) {
			reject(ex);
		}
	});
}

//todo: replace with strangler
var combine = function (blockOne, blockTwo, style) {
	const linesOne = blockOne.split('\n');
	const linesTwo = blockTwo.split('\n');
	const diff = Math.max(linesOne.length - linesTwo.length, 0);
	linesOne.forEach(function (line, index) {
		if (index >= diff) {
			if (style) {
				linesOne[index] = linesOne[index] + AsciiArt.Ansi.Codes(linesTwo[index - diff], style, true);
			} 
			else {
				linesOne[index] = linesOne[index] + linesTwo[index - diff];
			}
		}
	});
	return linesOne.join('\n');
};
var safeCombine = function (oldText, newText, style) {
	return combine(
		oldText ||
		(new Array(newText.split('\n').length)).join('\n'),
		newText,
		style
	);
}
AsciiArt.Figlet.create = function (options, callback, extended) {
	if ((typeof callback !== 'function') ||
		(extended && typeof extended === 'function')
	) {
		options = {
			text: options,
			font: callback
		}
		callback = extended;
	}

	if (!callback) {
		return AsciiArt.Figlet.newReturnContext(options);
	} 
	else {
		AsciiArt.Figlet.write(options.text, options.font, function (text) {
			var result = safeCombine(undefined, text, options.style);
			callback(result);
		});
	}
}

export default AsciiArt.Figlet;