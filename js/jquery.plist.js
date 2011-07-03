(function($) {


	$.parsePlist = function(xml) {

		// Non <plist> nodes must be filetered out
		var $xml = $(xml).filter(function () {

			return this.nodeName.toLowerCase() == 'plist';

		});

		// Parse the root node
		return parse($xml.children());

	};


	// Checks the node type against the supported node types, parsing
	// ones we support, and setting anything else as a string
	function parse(node) {

		switch (node[0].tagName.toLowerCase()) {
			case 'dict':
				return parseDict(node.children());
			case 'array':
				return parseArray(node.children());
			case 'number':
				return parseFloat(node.text());
			case 'true':
				return true;
			case 'false':
				return false;
			default:
				return node.text();
		}

	}

	
	function parseDict(nodes) {

		var dict = {};

		// Loop through the keys (every other node)
		for (var i = 0; i < nodes.length; i += 2) {

			var keyNode		= nodes[i],
				valueNode	= nodes[i + 1];
			
			// sanity check to make sure this is actually a key
			if (keyNode.tagName.toLowerCase() != 'key')
				throw 'expected <key> but found <' + keyNode.tagName + '>';
			
			dict[keyNode.textContent] = parse($(valueNode));

		}

		return dict;

	}

	
	function parseArray(nodes) {

		var array = [];

		nodes.each(function(i, node) {

			array[i] = parse($(node));

		});

		return array;

	}

	
})(jQuery);

