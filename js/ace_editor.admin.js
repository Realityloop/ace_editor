(function($) {

  Drupal.behaviors.ace_editor_admin = {
	attach: function(context, settings) {
		
		// Contains the settings for the editors.
		var editorSettings;
		
		/**
		* If the user selected a text format configured to be used with the editor,
		* show it, else show the default textarea.
		*/
		function acifyWrapper($textFormatWrapper) {
			
			// The select list for chosing the text format that will be used.
			var $filterSelector = $textFormatWrapper.find('select.filter-list');
			
			// Checks if the currently selected filter is one that uses the editor.
			if ($.inArray($filterSelector.val(), Drupal.settings.ace_editor.admin.text_formats) != -1) {
				
				/**
				 * If the settings has not been set I will copy them into a new object.
				 * if I don't the settings will be duplicated every time I add a textarea
				 * on fields that supports multiple values.
				 */
				if (!editorSettings) {
					editorSettings = $.extend({}, Drupal.settings.ace_editor.admin);
				}
				
				// Check to see if the editor has been added yet.
				if (!$textFormatWrapper.find('div.ace-editor-container').length) {
					
					// Init the array that will hold all editor elements and instances inside
					// of each text format wrapper.
					var editors = new Array();
					
					// Iterate through all textarea containers that and attach the editor.
					$('div.form-item.form-type-textarea', $textFormatWrapper).each(function(i) {
						var $form_item = $(this);
						
						// Create the editors container.
						var $ace_editor_container = $('<div class="ace-editor-container"></div>');
					
						// Put the different parts together.
						var $pre = $('<pre id="' + $(this).find('textarea').attr('id') + '-aced"></pre>');
						$ace_editor_container.append($pre);
						// Only append controlls to the main form item.
						var $controls;
						if ($(this).attr('class').indexOf("-value") != -1) {
							$pre.css({'height': '600px'});
							
							$controls = get_editor_controls();
							$ace_editor_container.append($controls);
							$(this).append($ace_editor_container);
						} else { // It's a summary form item.
							$pre.css({'height': '200px', 'border-bottom': '1px solid #CCC'});
							
							// Have to show the summary for the theme to be applied correctly, but do not show if it contains anything.
							if ($(this).find('textarea').val() == "") {
								$(this).parents('div.text-format-wrapper').find('a.link-edit-summary').trigger('click');
							}
							
							$(this).find('div.form-textarea-wrapper').after($ace_editor_container);
						}
						
						// Initialize the editor and set the correct options.
						var editor_instance = ace.edit($pre.attr('id'));
						if (editorSettings.theme == 'dark') {
							editor_instance.setTheme("ace/theme/twilight");
						} else {
							editor_instance.setTheme("ace/theme/textmate");
						}
						var HTMLMode = require("ace/mode/html").Mode;
						editor_instance.getSession().setMode(new HTMLMode());
						editor_instance.setShowPrintMargin(editorSettings['printmargin']);
						editor_instance.renderer.setHScrollBarAlwaysVisible(false);
						$pre.css('font-size', editorSettings['fontsize']);
						
						var editorObject = {
							editor: editor_instance,
							element: $pre
						};
						editors.push(editorObject);
						
						// Add event listeners.
						editor_instance.getSession().on('change', function(editor) {
							editorContentChange($form_item, editorObject);
						});
					});
					
					// Store the newly created editor instances for later use
					$textFormatWrapper.data('ace-editors', editors);
					
					// Set control states.
					$textFormatWrapper.find('div.ace-editor-controls').each(function(i) {
						var $controls = $(this);
						
						$controls.find('input.show_hidden').attr('checked', (localStorage['ace_editor_show_hidden'] == 1) ? true : false);
						$controls.find('input.show_line_numbers').attr('checked', (localStorage['ace_editor_show_line_numbers'] == 1) ? true : false);
						
						// Trigger controls.
						$controls.find('div.control input').trigger('change');
					});
				}
				
				// Get all of the editor objects for the text format wrapper.
				var editorObjects, editorsJustAdded = false;
				if (editors) {
					editorObjects = editors;
					editorsJustAdded = true;
				} else {
					editorObjects = $textFormatWrapper.data('ace-editors');
				}
				
				// Only switch if editors are hidden.
				if (!$(editorObjects[0]["element"]).is(':visible') || editorsJustAdded) {
				
					// Show the editor containers and hide the textarea containers.
					$(editorObjects).each(function(i) {
						var $formItem = $(this["element"]).parents('div.form-item:first');
						var $textAreaWrapper = $formItem.find('div.form-textarea-wrapper');
						var $editorContainer = $formItem.find('div.ace-editor-container');
					
						// Add the content of the field to the editors current session.
						this["editor"].getSession().setValue($textAreaWrapper.find('textarea').val());
					
						$textAreaWrapper.hide();
						$editorContainer.show();
					});
				}
					
			} else { // Show the textarea.
				
				var editorObjects = $textFormatWrapper.data('ace-editors');
				if (editorObjects) {
					
					// Only switch of editors are shown.
					if ($(editorObjects[0]["element"]).is(':visible')) {
						$(editorObjects).each(function(i) {
							var editorObj = editorObjects[i];
						
							var $formItem = $(editorObj["element"]).parents('div.form-item:first');
							var $textAreaWrapper = $formItem.find('div.form-textarea-wrapper');
							var $editorContainer = $formItem.find('div.ace-editor-container');
						
							// Transfer content from editor to textarea.
							$textAreaWrapper.find('textarea').val(editorObj['editor'].getSession().getValue())
						
							// Hide the editor containers and show the textarea containers.
							$textAreaWrapper.show();
							$editorContainer.hide();
						});
					}
				}
				
			}
		}
		
		/**
		* Bind the change event to all text format select lists.
		*/
		$('div.text-format-wrapper fieldset.filter-wrapper select.filter-list').live('change', function(e) {
			var $textFormatWrapper = $(this).parents('div.text-format-wrapper:first');
			acifyWrapper($textFormatWrapper);
		});
	
		/**
		 * Update the editors to reflect the toggled option.
		 */
		$('div.text-format-wrapper div.control input').live('change', function(e) {
			
			var $control = $(this);
			var $textFormatWrapper = $(this).parents('div.text-format-wrapper:first');
			var editorObjects = $textFormatWrapper.data('ace-editors');
						
			var checked;
			if ($control.attr('type') == 'checkbox') {
				checked = $(this).is(':checked') ? 1 : 0;
			}
			
			// Apply settings to all editors.
			$(editorObjects).each(function(i) {
				switch ($control.attr('name')) {
					case "show_hidden":
						this['editor'].setShowInvisibles(checked);
						break;
					case "show_line_numbers":
						this['editor'].renderer.setShowGutter(checked);
						break;
				}
			});
			
			// Save settings 'till next time.
			// TODO: Think about multiple instances here...
			switch ($control.attr('name')) {
				case "show_hidden":
					localStorage['ace_editor_show_hidden'] = checked;
					break;
				case "show_line_numbers":
					localStorage['ace_editor_show_line_numbers'] = checked;
					break;
			}
		});
		
		/**
		 * The content of the editor has changed, update the span showing line numbers.
		 * Also transfer the content of the editors to their related textareas.
		 *
		 * TODO: Think about a better way to transfer the data between the editor and the textarea,
		 * I have tried doing this in a the 'blur'-event of the editor, but content wont get saved
		 * every time...
		 */
		function editorContentChange($form_item, editorObject) {
			$(editorObject['element']).parents('div.ace-editor-container:first').find('div.ace-editor-controls span.num-lines').text(editorObject['editor'].getSession().getValue().split("\n").length + " lines");
			
			var $textarea = $form_item.find('textarea');
			var val = editorObject['editor'].getSession().getValue();
			$textarea.html(val);
		}
		
		/**
		*	Returns the controls for an editor.
		*/
		function get_editor_controls() {
			$controls = $('<div class="ace-editor-controls"></div>');
			$controls.append('<div class="control"><input type="checkbox" name="show_hidden" class="show_hidden" checked>' + 
							  '<label>Invisibles</label></div>');
			$controls.append('<div class="control"><input type="checkbox" name="show_line_numbers" class="show_line_numbers" checked>' + 
							  '<label>Line numbers</label></div>');
			$controls.append('<div class="info"><span class="num-lines">1 lines</span><a class="key-bindings" target="_blank" href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts">Show key bindings</a></div>');
			return $controls;
		}
		
		/**
		* Set defaults to the controls.
		*/
		if (localStorage['ace_editor_show_hidden'] == undefined) {
			localStorage['ace_editor_show_hidden'] = 1;
			localStorage['ace_editor_show_line_numbers'] = 1;
		}		
	}
};

})(jQuery);
