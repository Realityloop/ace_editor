(function($) {

  Drupal.behaviors.ace_editor_field_format = {
	attach: function(context, settings) {
		
		var formatFilterSettings = Drupal.settings.ace_editor.format_filter_settings;
		
		var SyntaxMode = require("ace/mode/" + formatFilterSettings['syntax']).Mode;
		var themePath = "ace/theme/" + formatFilterSettings['theme'];
		$(Drupal.settings.ace_editor.format_filter_instances).each(function(i) {
			var $pre = $('#' + this['id']);
			var html = this['content'];
			
			var editor_instance = ace.edit(this['id']);
			editor_instance.getSession().setMode(new SyntaxMode());
			editor_instance.setTheme(themePath);
			editor_instance.renderer.setShowGutter(formatFilterSettings['line_numbers']);
			editor_instance.setShowPrintMargin(formatFilterSettings['print_margin']);
			editor_instance.setShowInvisibles(formatFilterSettings['invisibles']);
			editor_instance.setReadOnly(true);
			$pre.css({
				'font-size': formatFilterSettings['font_size'],
				'height': formatFilterSettings['field_height'],
				'width': formatFilterSettings['field_width']
			});
			
			// Set the height of the editor if field_height is set to auto.
			/*
			if (formatFilterSettings['field_height'] == 'auto') {
				editor_instance.getSession().on('change', function(e) {
					var cursorHeight = $pre.find('div.ace_cursor:first').height();
					//alert(cursorHeight);
					$pre.css('height', (editor_instance.getSession().getValue().split('\n').length + 2) * cursorHeight);
				});
			}
			*/
			
			editor_instance.getSession().setValue(html);
		});
		
		
	}
  };

})(jQuery);
