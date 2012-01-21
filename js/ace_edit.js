(function($) {

  Drupal.behaviors.ace_editor = {
    attach: function(context, settings) {
		
		/**
		 *
		 */
		function setAceState($textArea) {
			
			// Top Level, for traversing.
			var $textFormatWrapper = $textArea.parents('div.text-format-wrapper:first');
			// The container that will hold the <pre>.
			var $formItem = $textFormatWrapper.find('div.form-item[class*="-value"]:first');
			// The select list for chosing the text format that will be used.
			var $filterSelector = $textFormatWrapper.find('select.filter-list');
			
			// If the text format's name is ace_editor then we'll add the editor.
			if ($filterSelector.val() == 'ace_editor') {
				
				var aceEditor, $pre;
				
				// Check to see if the pre element exists, if not, create it.
				if (!$formItem.find('pre').length) {
					// Create the tag and add default styling to it.
					$pre = $('<pre id="' + $textArea.attr('id') + '-aced"></pre>');
					$pre.css({
						'position': 'relative',
						'height': '600px',
						'border': '1px solid #ccc',
						'margin-bottom': '0px',
						'font-size': '10pt'
					});
					
					$formItem.append($pre);
					
					// Ace it! TODO: Add settings page to let the user configure this.
					aceEditor = ace.edit($pre.attr('id'));
				    aceEditor.setTheme("ace/theme/twilight");
					var HTMLMode = require("ace/mode/html").Mode;
				    aceEditor.getSession().setMode(new HTMLMode());
					aceEditor.setShowPrintMargin(false);
					
					// Store the editor instance to the pre element for later use.
					$pre.data('ace-editor', aceEditor);
					
				} else {
					
					// Find the pre elements.
					$pre = $formItem.find('pre');
					
					// The pre tag exists, and so does the editor instance.
					aceEditor = $pre.data('ace-editor');
				}
				
				// Add the content of the field to the editors current session.
				aceEditor.getSession().setValue($textArea.val());
				
				// Show the editor's pre and hide the textarea.
				$pre.show();
				$formItem.find('div.form-textarea-wrapper').hide();
				
			} else {
				
				// Fins the pre element.
				var $pre = $formItem.find('pre');
				
				// Fetch the Ace Editor instance from the pre.
				var aceEditor = $pre.data('ace-editor');
				
				// Set the text of the textarea to reflect the changes in the Ace Editor.
				$textArea.val(aceEditor.getSession().getValue());

				// Hide the Ace Editor and show the textarea.
				$pre.hide();
				$formItem.find('div.form-textarea-wrapper').show();
			}
		}
		
		/**
		 *
		 */
		$('div.text-format-wrapper fieldset.filter-wrapper select.filter-list').live('change', function(e) {
			var $textArea = $(this).parents('div.text-format-wrapper:first').find('div.form-type-textarea[class*="-value"] textarea');
			setAceState($textArea);
		});
	
		/**
		 * Transfer over the html of the editor to the correct field.
		 */
		$('#edit-submit').click(function() {
			$('div.form-item.form-type-textarea').each(function (i) {
				var $pre = $(this).find('pre.ace_editor');
				if ($pre.length) {
					var filterListValue = $(this).siblings('fieldset.filter-wrapper:first').find('select.filter-list').val();
					if (filterListValue == 'ace_editor') {
						var $textArea = $(this).find('textarea');
						var aceEditor = $pre.data('ace-editor');
						var html = aceEditor.getSession().getValue();
						$textArea.val(html);
					}
				}
			});
		});
	
		/**
		 *
		 */
		
		$('div.form-type-textarea[class*="-value"] textarea').each(function(i) {
			// Is in a text format wrapper.
			if ($(this).parents('div.text-format-wrapper').length) {
				//setAceState($(this));
			}
		});
		
    }
  };

})(jQuery);
