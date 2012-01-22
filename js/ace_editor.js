(function($) {

  Drupal.behaviors.ace_editor = {
	attach: function(context, settings) {
		
		/**
		* If the user selected a text format configured to be used with the editor,
		* show it, else show the default textarea.
		*/
		function setAceState($textArea) {
			
			// Top Level, for traversing.
			var $textFormatWrapper = $textArea.parents('div.text-format-wrapper:first');
			// The container that will hold the <pre>.
			var $formItem = $textFormatWrapper.find('div.form-item[class*="-value"]:first');
			// The select list for chosing the text format that will be used.
			var $filterSelector = $textFormatWrapper.find('select.filter-list');

			// If the text format's name is ace_editor then we'll add the editor.
			if ($.inArray($filterSelector.val(), Drupal.settings.ace_editor.text_formats) != -1) {
				
				var ace_editor_instanceInstance, $ace_editor_container;
				
				// Check to see if the pre element exists, if not, create it.
				if (!$formItem.find('div.ace-editor-container').length) {
					// Create the tag and add default styling to it.
					
					$ace_editor_container = $('<div class="ace-editor-container"></div>');
					var $pre = $('<pre id="' + $textArea.attr('id') + '-aced"></pre>');
					
					// Put the different parts together.
					$ace_editor_container.append($pre);
					var $controls = get_editor_controls();
					$ace_editor_container.append($controls);
					$formItem.append($ace_editor_container);
					
					// Ace it! TODO: Add settings page to let the user configure this.
					ace_editor_instance = ace.edit($pre.attr('id'));
					var defaultFontSize;
					if (Drupal.settings.ace_editor.theme == 'dark') {
						ace_editor_instance.setTheme("ace/theme/twilight");
						defaultFontSize = '10pt';
					} else {
						ace_editor_instance.setTheme("ace/theme/textmate");
						defaultFontSize = '9pt';
					}
					var HTMLMode = require("ace/mode/html").Mode;
					ace_editor_instance.getSession().setMode(new HTMLMode());
					ace_editor_instance.setShowPrintMargin(false);
					ace_editor_instance.renderer.setHScrollBarAlwaysVisible(false);
					
					// Store the editor instance to the pre element for later use.
					$ace_editor_container.data('ace-editor', ace_editor_instance);
					
					// Set control states.
					$controls.find('input.show_hidden').attr('checked', (localStorage['ace_editor_show_hidden'] == 1) ? true : false);
					$controls.find('input.show_line_numbers').attr('checked', (localStorage['ace_editor_show_line_numbers'] == 1) ? true : false);
					$controls.find('input.show_print_margin').attr('checked', (localStorage['ace_editor_show_print_margin'] == 1) ? true : false);

					var fontSize = localStorage['ace_editor_font_size'];
					if (fontSize) {
						$controls.find('select.font_size').val(fontSize);
					} else {
						$controls.find('select.font_size').val(defaultFontSize);
					}
					
					// Initial line count, apperantly it needs some time before the line can be fetched correctly.
					this.setTimeout(function() {
						editorContentChange($ace_editor_container);
					}, 10);
					
					// Trigger controls.
					$ace_editor_container.find('div.ace-editor-controls input, div.ace-editor-controls select').trigger('change');
					
				} else {
					
					// Find the pre elements.
					$ace_editor_container = $formItem.find('div.ace-editor-container');
					
					// The pre tag exists, and so does the editor instance.
					ace_editor_instance = $ace_editor_container.data('ace-editor');
				}
				
				// Add the content of the field to the editors current session.
				ace_editor_instance.getSession().setValue($textArea.val());
				
				// Add a change listener to the editor.
				ace_editor_instance.getSession().on('change', function(editor) {
					editorContentChange($ace_editor_container);
				});
				
				// Show the editor's pre and hide the textarea.
				$ace_editor_container.show();
				$formItem.find('div.form-textarea-wrapper').hide();
				
			} else {
				
				// Fins the pre element.
				var $ace_editor_container = $formItem.find('div.ace-editor-container');
				
				// Fetch the Ace Editor instance from the pre.
				var ace_editor_instance = $ace_editor_container.data('ace-editor');
				
				// Set the text of the textarea to reflect the changes in the Ace Editor.
				$textArea.val(ace_editor_instance.getSession().getValue());

				// Hide the Ace Editor and show the textarea.
				$ace_editor_container.hide();
				$formItem.find('div.form-textarea-wrapper').show();
			}
		}
		
		/**
		*	Returns the editor controls.
		*/
		function get_editor_controls() {
			$controls = $('<div class="ace-editor-controls"></div>');
			
			$controls.append('<div class="control"><input type="checkbox" name="show_hidden" class="show_hidden" checked>' + 
							  '<label>Invisibles</label></div>');
							
			$controls.append('<div class="control"><input type="checkbox" name="show_line_numbers" class="show_line_numbers" checked>' + 
							  '<label>Line numbers</label></div>');
							
			$controls.append('<div class="control"><input type="checkbox" name="show_print_margin" class="show_print_margin" checked>' + 
							  '<label>Print margin</label></div>');
							
			$controls.append('<div class="control"><select name="font_size" class="font_size">' + 
							 '<option value="9pt">9pt</option>' +
							 '<option value="10pt">10pt</option>' +
							 '<option value="11pt">11pt</option>' +
							 '<option value="12pt">12pt</option>' + 
							 '</select></div>');
			
			$controls.append('<div class="info"><span class="num-lines"></span><a class="key-bindings" target="_blank" href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts">Show key bindings</a></div>');
			
			return $controls;
		}
		
		/**
		* Bind the change event to all text format select lists.
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
						var ace_editor_instance = $pre.data('ace-editor');
						var html = ace_editor_instance.getSession().getValue();
						$textArea.val(html);
					}
				}
			});
		});
		
		
		$('div.control input, div.control select').live('change', function(e) {
			var ace_editor_instance = $(this).parents('div.ace-editor-container:first').data('ace-editor');
			
			var checked;
			if ($(this).attr('type') == 'checkbox') {
				checked = $(this).is(':checked') ? 1 : 0;
			}
			
			switch ($(this).attr('name')) {
				case "show_hidden":
					ace_editor_instance.setShowInvisibles(checked);
					localStorage['ace_editor_show_hidden'] = checked;
					break;
				case "show_line_numbers":
					ace_editor_instance.renderer.setShowGutter(checked);
					localStorage['ace_editor_show_line_numbers'] = checked;
					$(this).parents('div.ace-editor-controls:first').find('input.show_hidden').css('margin-left', checked ? '70px' : '20px');
					break;
				case "show_print_margin":
					ace_editor_instance.setShowPrintMargin(checked);
					localStorage['ace_editor_show_print_margin'] = checked;
					break;
				case "font_size":
					var fontSize = $(this).val();
					$(this).parents('div.ace-editor-container:first').find('pre').css('font-size', fontSize);
					localStorage['ace_editor_font_size'] = fontSize;
					break;
			}
			
		});
		
		/**
		* The content of the editor has changed, update the span showing line numbers.
		*/
		function editorContentChange($ace_editor_container) {
			var editor = $ace_editor_container.data('ace-editor');
			$ace_editor_container.find('div.ace-editor-controls span.num-lines').text(editor.getSession().getValue().split("\n").length + " lines");
		}
		
		/**
		* Set defaults to the controls.
		*/
		if (localStorage['ace_editor_show_hidden'] == undefined) {
			localStorage['ace_editor_show_hidden'] = 1;
			localStorage['ace_editor_show_line_numbers'] = 1;
			localStorage['ace_editor_show_print_margin'] = 0;
		}
		
		
	}
  };

})(jQuery);
