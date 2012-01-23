(function($) {

  Drupal.behaviors.ace_editor_field_format = {
	attach: function(context, settings) {
		
		var fieldSettings = Drupal.settings.ace_editor.field_format_settings;
		
		var SyntaxMode = require("ace/mode/" + fieldSettings['syntax']).Mode;
		var themePath = "ace/theme/" + fieldSettings['theme'];
		$(Drupal.settings.ace_editor.field_format_instances).each(function(i) {
			var $pre = $('#' + this['id']);
			var html = this['content'];
			
			var editor_instance = ace.edit(this['id']);
			editor_instance.getSession().setMode(new SyntaxMode());
			editor_instance.setTheme(themePath);
			editor_instance.renderer.setShowGutter(fieldSettings['line_numbers']);
			editor_instance.setShowPrintMargin(fieldSettings['print_margin']);
			editor_instance.setShowInvisibles(fieldSettings['invisibles']);
			editor_instance.setReadOnly(true);
			$pre.css('font-size', fieldSettings['font_size']);
			
			editor_instance.getSession().setValue(html);
		});
		
	}
  };

})(jQuery);
