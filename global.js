$(function () {

	var $body = $("body");
	$body.bind("drop", onDrop);
	$body.bind("dragenter dragexit dragover", noopHandler);

});


function onDrop (event) {

	// jQuery breaks the drop event for some reason, so we use the original
	var event			= event.originalEvent,
		files			= event.dataTransfer.files,
		filesCount		= event.dataTransfer.files.length,

		// Key is emoticon's filename and value is the file object
		emoticonFiles	= {};

	for (var i = 0; i < filesCount; i++) {

		var file = files[i];

		if (file.fileName == "Emoticons.plist")
			var plistFile = file;
		else
			emoticonFiles[file.fileName] = file;

	}

	// Start reading the Plist once we've stored references to all the emoticons
	var reader = new FileReader();

	reader.onloadend = function (event) {

		processPlist(event, emoticonFiles);

	};

	reader.readAsText(plistFile);

	// Stop the browser from navigating to the file(s)
	event.preventDefault();
	event.stopPropagation();
	return false;

}


function processPlist (event, emoticonFiles) {

	$plist = $.parsePlist(event.target.result);

	$.each($plist['Emoticons'], function (filename, emoticon) {

		var reader 	= new FileReader(),
			file 	= emoticonFiles[filename];

		reader.onloadend = function (event) {

			var $div = $('<div class="emoticon"></div>');
			$div.append('<img src="' + event.target.result + '" />');
			var $p = $('<p/>');
			$div.append($p);

			$.each(emoticon['Equivalents'], function (i, shortcut) {

				var $span = $('<span>' + shortcut + '</span>');
				if (i) $span.addClass('alternate');
				$p.append($span);

			});

			$('body').append($div);

		};

		reader.readAsDataURL(file);

	});

}


function noopHandler (event) {

	event.preventDefault();
	event.stopPropagation();

	return false;

}
