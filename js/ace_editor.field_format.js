(function($) {

  Drupal.behaviors.ace_editor_field_format = {
	attach: function(context, settings) {
		
		var fieldFormatSettings = Drupal.settings.ace_editor.field_format_settings;
		
		var SyntaxMode = require("ace/mode/" + fieldFormatSettings['syntax']).Mode;
		var themePath = "ace/theme/" + fieldFormatSettings['theme'];
		$(Drupal.settings.ace_editor.field_format_instances).each(function(i) {
			var $pre = $('#' + this['id']);
			var html = this['content'];
			
			var editor_instance = ace.edit(this['id']);
			editor_instance.getSession().setMode(new SyntaxMode());
			editor_instance.setTheme(themePath);
			editor_instance.renderer.setShowGutter(fieldFormatSettings['line_numbers']);
			editor_instance.setShowPrintMargin(fieldFormatSettings['print_margin']);
			editor_instance.setShowInvisibles(fieldFormatSettings['invisibles']);
			editor_instance.setReadOnly(true);
			$pre.css({
				'font-size': formatFilterSettings['font_size'],
				'height': formatFilterSettings['field_height'],
				'width': formatFilterSettings['field_width']
			});
			
			editor_instance.getSession().setValue(html);
		});
		
		
	}
  };

})(jQuery);
