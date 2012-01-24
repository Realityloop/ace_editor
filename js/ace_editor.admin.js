(function($) {

  Drupal.behaviors.ace_editor_admin = {
	attach: function(context, settings) {
		
		/**
		* If the user selected a text format configured to be used with the editor,
		* show it, else show the default textarea.
		*/
		function setAceState($textFormatWrapper) {

			// The select list for chosing the text format that will be used.
			var $filterSelector = $textFormatWrapper.find('select.filter-list');
			
			// TODO: Add documentation.
			if ($.inArray($filterSelector.val(), Drupal.settings.ace_editor.admin.text_formats) != -1) {
				
				var editorSettings = Drupal.settings.ace_editor.admin;
				
				// Check to see if the editor has been added yet.
				if (!$textFormatWrapper.find('div.ace-editor-container').length) {
					
					var editors = new Array();
					
					// Iterate through all textarea containers that and attach the editor.
					$('div.form-item.form-type-textarea', $textFormatWrapper).each(function(i) {

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
						
						editor_instance.getSession().on('change', function(editor) {
							editorContentChange(editorObject);
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
		*	Returns the editor controls.
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
		* Bind the change event to all text format select lists.
		*/
		$('div.text-format-wrapper fieldset.filter-wrapper select.filter-list').live('change', function(e) {
			var $textFormatWrapper = $(this).parents('div.text-format-wrapper:first');
			setAceState($textFormatWrapper);
		});
	
		/**
		* Transfer over the html of the editor to the correct field.
		*/
		$('#edit-submit').click(function() {
			
			$('div.text-format-wrapper').each(function() {
				
				// The select list for chosing the text format that will be used.
				var $filterSelector = $(this).find('select.filter-list');

				// If currently in editor mode. Transfer the values of all editors to their related textareas.
				if ($.inArray($filterSelector.val(), Drupal.settings.ace_editor.admin.text_formats) != -1) {
					
					var editorObjects = $(this).data('ace-editors');
					$(editorObjects).each(function(i) {
						
						var $formItem = $(this["element"]).parents('div.form-item:first');
						var $textAreaWrapper = $formItem.find('div.form-textarea-wrapper');
						var $editorContainer = $formItem.find('div.ace-editor-container');
						
						// Transfer content from editor to textarea.
						$textAreaWrapper.find('textarea').val(this['editor'].getSession().getValue())
					});
				}
			});
		});
		
		
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
			
			// Save settings.
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
		*/
		function editorContentChange(editorObject) {
			$(editorObject['element']).parents('div.ace-editor-container:first').find('div.ace-editor-controls span.num-lines').text(editorObject['editor'].getSession().getValue().split("\n").length + " lines");
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
